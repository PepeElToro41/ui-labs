import { useEffect } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { Array } from "@rbxts/sift";
import { useStoryList } from "Hooks/Reflex/Use/Modules";
import { useStorybooks } from "Hooks/Reflex/Use/Requires";

import { GenerateNodes } from "./Utils";

//Creates all the nodes (What is displayed in the explorer tree)
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
