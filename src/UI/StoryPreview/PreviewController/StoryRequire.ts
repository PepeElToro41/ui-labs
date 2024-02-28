import { useSelector } from "@rbxts/react-reflex";
import { useState, useEffect } from "@rbxts/roact";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { HotReloader } from "Utils/HotReloader";

interface StoryResult {
	reloader: HotReloader;
	node: StoryNode;
	result: unknown;
}

export function useStoryRequire(entry: PreviewEntry) {
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [result, setResult] = useState<StoryResult>();
	const [reloader, setReloader] = useState<HotReloader>();

	useEffect(() => {
		setResult(undefined);
		if (!node) return;

		const reloadResult = HotReloader.require(node.Module);
		setReloader(reloadResult.Reloader);
		const apply = reloadResult.Result.then((reloadResult) => {
			if (!reloadResult.Sucess) return;
			const result = reloadResult.Result;
			setResult({ result, node, reloader: reloadResult.Reloader });
		});

		return () => {
			apply.cancel();
			reloadResult.Reloader.Destroy();
		};
	}, [entry.UID]);

	useEffect(() => {
		if (!result) return;
		if (!node) return;
		const reloader = result.reloader;
		const changed = reloader.OnReloaded.Connect((reloadResult) => {
			if (!reloadResult.Sucess) return;
			const result = reloadResult.Result;
			setResult({ result, node, reloader });
		});

		return () => changed.Disconnect();
	}, [result]);

	return $tuple(result, reloader);
}
