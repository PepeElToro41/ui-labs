import { Janitor } from "@rbxts/janitor";
import { useAsync, useLatest } from "@rbxts/pretty-react-hooks";
import { useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import {
	useGetInputSignalsFromFrame,
	useInputSignals
} from "Context/UserInputContext";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectPluginWidget } from "Reflex/Plugin";
import { Environment } from "Utils/HotReloader/Environment";
import { HotReloader } from "Utils/HotReloader/HotReloader";
import { CreateTuple } from "Utils/MiscUtils";
import { CreateEntrySnapshot, ReloadEntry } from "../Utils";

export function useStoryRequire(
	entry: PreviewEntry,
	studioMode: boolean,
	canReload: boolean
) {
	const plugin = usePlugin();
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [reloader, setReloader] = useState<HotReloader>();
	const [reloadQuery, setReloadQuery] = useState(false);
	const [resultPromise, setResultPromise] = useState<Promise<unknown>>();
	const { unmountByUID, updateMountData } = useProducer<RootProducer>();
	const widget = useSelector(selectPluginWidget);
	const inputs = useGetInputSignalsFromFrame(entry.ListenerFrame);
	const inputSignals = useInputSignals(inputs);

	const latestInput = useLatest(inputSignals);
	const latestEntry = useLatest(entry);
	const InjectGlobalControls = useCallback(
		(environment: Environment) => {
			const pluginInjection: Record<string, unknown> = {};
			const janitor = new Janitor();
			const runtimeListeners: Array<() => void> = [];

			pluginInjection["Unmount"] = () => {
				unmountByUID(latestEntry.current.UID);
			};
			pluginInjection["Reload"] = () => {
				ReloadEntry(latestEntry.current);
			};
			pluginInjection["__RunOnRuntimeListeners__"] = () => {
				runtimeListeners.forEach((listener) => {
					listener();
				});
			};
			pluginInjection["OnRuntimeStart"] = (listener: () => void) => {
				if (pluginInjection["Runtime"] === undefined) {
					runtimeListeners.push(listener);
				} else {
					listener();
				}
			};
			pluginInjection["SetStoryHolder"] = (holder?: Instance) => {
				updateMountData(latestEntry.current.UID, (oldData) => {
					return {
						...oldData,
						OverrideHolder: holder
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

			environment.InjectGlobal(Configs.GlobalInjectionKey, pluginInjection);

			return () => {
				janitor.Destroy();
			};
		},
		[entry.UID, widget]
	);

	//Creating the hot reloader
	useEffect(() => {
		if (!node) return;

		const reloader = new HotReloader(node.Module);
		reloader.HookOnReload((environment) => {
			const cleanup = InjectGlobalControls(environment);
			environment.HookOnDestroyed(() => {
				cleanup();
			}, 2);
		}, 2);

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
		reloader.AutoReload = !studioMode && entry.AutoReload;

		const changed = reloader.OnReloadStarted.Connect((promise) => {
			setResultPromise(promise);
		});
		if (studioMode && entry.AutoReload) {
			const onReloadQuery = reloader.OnDependencyChanged.Connect(() => {
				setReloadQuery(true);
			});
			return () => {
				onReloadQuery.Disconnect();
				changed.Disconnect();
			};
		} else {
			setReloadQuery(false);
		}
		return () => changed.Disconnect();
	}, [reloader, studioMode, entry.AutoReload]);

	// Flushing queried reloads (studio mode)
	useEffect(() => {
		if (!reloader) return;
		if (!reloadQuery) return;
		if (!canReload) return;
		if (!studioMode) return;

		reloader.ScheduleReload();
		setReloadQuery(false);
	}, [reloader, reloadQuery, canReload, studioMode]);

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
