import { useSelector } from "@rbxts/react-reflex";
import { useState, useEffect } from "@rbxts/react";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { HotReloader } from "Utils/HotReloader";
import { CreateTuple } from "Utils/MiscUtils";
import { useAsync } from "@rbxts/pretty-react-hooks";

export function useStoryRequire(entry: PreviewEntry) {
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [resultPromise, setResultPromise] = useState<Promise<unknown>>();
	const [reloader, setReloader] = useState<HotReloader>();

	//Creating the hot reloader
	useEffect(() => {
		if (!node) return;

		const reloadResult = HotReloader.require(node.Module);
		setReloader(reloadResult.Reloader);
		setResultPromise(reloadResult.Result);

		return () => {
			reloadResult.Reloader.Destroy();
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

		return resultPromise;
	}, [resultPromise]);

	return CreateTuple(result, reloader);
}
