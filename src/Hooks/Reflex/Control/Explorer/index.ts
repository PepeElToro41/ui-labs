import { useEffect } from "@rbxts/roact-hooked";
import { Array } from "@rbxts/sift";
import { useStoryList } from "Hooks/Reflex/Use/Modules";
import { useStorybooks } from "Hooks/Reflex/Use/Requires";
import { GenerateNodes } from "./Utils";
import { useProducer } from "@rbxts/roact-reflex";

export function controlNodes() {
	const storyList = useStoryList();
	const storybooks = useStorybooks();

	const { setNodes } = useProducer<RootProducer>();

	useEffect(() => {
		const newStoryList = Array.copy(storyList);
		const { nodes, nodemap } = GenerateNodes(newStoryList, storybooks);
		setNodes(nodes, nodemap);
	}, [storyList, storybooks]);
}
