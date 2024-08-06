import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useState, useEffect, useCallback } from "@rbxts/react";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { CreateTuple } from "Utils/MiscUtils";
import { useAsync, useLatest } from "@rbxts/pretty-react-hooks";
import { CreateEntrySnapshot, ReloadEntry } from "../Utils";
import { selectPluginWidget } from "Reflex/Plugin";
import { Janitor } from "@rbxts/janitor";
import { useInputSignals } from "Context/UserInputContext";
import { Environment, HotReloader } from "@rbxts/hmr";
import Configs from "Plugin/Configs";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";

export function useStoryRequire(entry: PreviewEntry) {
	const plugin = usePlugin();
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [reloader, setReloader] = useState<HotReloader>();
	const [resultPromise, setResultPromise] = useState<Promise<unknown>>();
	const { unmountByUID, updateMountData } = useProducer<RootProducer>();
	const widget = useSelector(selectPluginWidget);
	const inputSignals = useInputSignals();

	const latestInput = useLatest(inputSignals);
	const latestEntry = useLatest(entry);

	const InjectGlobalControls = useCallback(
		(environment: Environment) => {
			const pluginInjection: Record<string, unknown> = {};
			const janitor = new Janitor();

			pluginInjection["Unmount"] = () => {
				unmountByUID(latestEntry.current.UID);
			};
			pluginInjection["Reload"] = () => {
				ReloadEntry(latestEntry.current);
			};
			pluginInjection["SetStoryHolder"] = (holder?: Instance) => {
				updateMountData(latestEntry.current.UID, (oldData) => {
					return {
						...oldData,
						OverrideHolder: holder,
					};
				});
			};
			pluginInjection["CreateSnapshot"] = (name?: string) => {
				CreateEntrySnapshot(latestEntry.current, name);
			};
			pluginInjection["InputListener"] = latestInput.current;
			pluginInjection["StoryJanitor"] = janitor;
			pluginInjection["PreviewUID"] = latestEntry.current.UID;
			pluginInjection["OriginalG"] = _G;
			pluginInjection["PluginWidget"] = widget;
			pluginInjection["EnvironmentUID"] = environment.EnvironmentUID;
			pluginInjection["Plugin"] = plugin;

			environment.HookOnDestroyed(() => {
				janitor.Destroy();
			});
			environment.InjectGlobal(Configs.GlobalInjectionKey, pluginInjection);
		},
		[entry.UID, widget],
	);

	//Creating the hot reloader
	useEffect(() => {
		if (!node) return;

		const reloader = new HotReloader(node.Module);
		reloader.BeforeReload(InjectGlobalControls);

		setResultPromise(reloader.Reload());
		setReloader(reloader);

		return () => {
			reloader.Destroy();
		};
	}, [entry.UID]);

	//Listen for hot reloader updates
	useEffect(() => {
		if (!node) return;
		if (!reloader) return;

		const changed = reloader.OnReloadStarted.Connect((promise) => {
			setResultPromise(promise);
		});

		return () => changed.Disconnect();
	}, [reloader]);

	//Resolving promises
	const [result] = useAsync(() => {
		if (!resultPromise) return Promise.resolve(undefined);

		return resultPromise.catch((err) => {
			if (Promise.Error.is(err)) {
				warn("Story errored while required: \n\n" + err.trace);
			} else {
				warn("Story errored while required: \n\n" + tostring(err));
			}
		});
	}, [resultPromise]);

	return CreateTuple(result, reloader);
}
