import { useEffect, useState } from "@rbxts/roact-hooked";
import { HotReloader } from "Utils/HotReloader";

interface StoryResult {
	reloader: HotReloader;
	node: StoryNode;
	result: unknown;
}

export function useStoryRequire(node?: StoryNode) {
	const [result, setResult] = useState<StoryResult>();

	useEffect(() => {
		setResult(undefined);
		if (!node) return;

		const [promise, reloader] = HotReloader.require(node.Module);
		const apply = promise.then((reloadResult) => {
			if (!reloadResult.Sucess) return;
			const result = reloadResult.Result;
			setResult({ result, node, reloader });
		});

		return () => {
			apply.cancel();
			reloader.Destroy();
		};
	}, [node]);

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

	return result;
}
