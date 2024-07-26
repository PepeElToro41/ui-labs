import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useState, useEffect, useCallback } from "@rbxts/react";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { HotReloader } from "Utils/HotReloader";
import { CreateTuple } from "Utils/MiscUtils";
import { useAsync, useLatest } from "@rbxts/pretty-react-hooks";
import { Environment } from "Utils/HotReloader/Environment";
import { CreateEntrySnapshot, ReloadEntry } from "../Utils";
import { selectPluginWidget } from "Reflex/Plugin";
import { Janitor } from "@rbxts/janitor";
import { useInputSignals } from "Context/UserInputContext";

export function useStoryRequire(entry: PreviewEntry) {
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [reloader, setReloader] = useState<HotReloader>();
	const [resultPromise, setResultPromise] = useState<Promise<unknown>>();
	const producer = useProducer<RootProducer>();
	const widget = useSelector(selectPluginWidget);
	const inputSignals = useInputSignals();

	const latestInput = useLatest(inputSignals);
	const latestEntry = useLatest(entry);

	const InjectGlobalControls = useCallback(
		(environment: Environment) => {
			const janitor = new Janitor();

			environment.InjectGlobal("Unmount", () => {
				producer.unmountByUID(latestEntry.current.UID);
			});
			environment.InjectGlobal("Reload", () => {
				ReloadEntry(latestEntry.current);
			});
			environment.InjectGlobal("CreateSnapshot", (name?: string) => {
				CreateEntrySnapshot(latestEntry.current, name);
			});

			environment.InjectEnvironmentUID();
			environment.InjectGlobal("InputListener", latestInput.current);
			environment.InjectGlobal("StoryJanitor", janitor);
			environment.InjectGlobal("PreviewUID", latestEntry.current.UID);
			environment.InjectGlobal("OriginalG", _G);
			environment.InjectGlobal("PluginWidget", widget);

			environment.HookOnDestroyed(() => {
				janitor.Destroy();
			});
		},
		[entry.UID, widget],
	);

	//Creating the hot reloader
	useEffect(() => {
		if (!node) return;

		const reloader = new HotReloader(node.Module);
		reloader.BindToReload(InjectGlobalControls);

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
