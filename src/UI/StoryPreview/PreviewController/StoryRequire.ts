import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useState, useEffect, useCallback } from "@rbxts/react";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { HotReloader } from "Utils/HotReloader";
import { CreateTuple } from "Utils/MiscUtils";
import { useAsync, useLatest } from "@rbxts/pretty-react-hooks";
import { Enviroment } from "Utils/HotReloader/Enviroment";
import { CreateEntrySnapshot, ReloadEntry } from "../Utils";
import { selectPluginWidget } from "Reflex/Plugin";
import { Janitor } from "@rbxts/janitor";
import { useInputSignals } from "Context/UserInputContext";

export function useStoryRequire(entry: PreviewEntry) {
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [resultPromise, setResultPromise] = useState<Promise<unknown>>();
	const [reloader, setReloader] = useState<HotReloader>();
	const producer = useProducer<RootProducer>();
	const widget = useSelector(selectPluginWidget);
	const inputSignals = useInputSignals();

	const latestInput = useLatest(inputSignals);
	const latestEntry = useLatest(entry);

	const InjectGlobalControls = useCallback(
		(enviroment: Enviroment) => {
			const janitor = new Janitor();

			enviroment.InjectGlobal("Unmount", () => {
				producer.unmountByUID(latestEntry.current.UID);
			});
			enviroment.InjectGlobal("Reload", () => {
				ReloadEntry(latestEntry.current);
			});
			enviroment.InjectGlobal("CreateSnapshot", (name?: string) => {
				CreateEntrySnapshot(latestEntry.current, name);
			});

			enviroment.InjectEnviromentUID();
			enviroment.InjectGlobal("InputListener", latestInput.current);
			enviroment.InjectGlobal("StoryJanitor", janitor);
			enviroment.InjectGlobal("PreviewUID", latestEntry.current.UID);
			enviroment.InjectGlobal("OriginalG", _G);
			enviroment.InjectGlobal("PluginWidget", widget);

			enviroment.HookOnDestroyed(() => {
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

		setReloader(reloader);
		setResultPromise(reloader.Reload());

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
