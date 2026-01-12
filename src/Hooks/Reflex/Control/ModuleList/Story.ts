import { useEffect } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import Configs from "Plugin/Configs";

import { useInstanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";

export function controlStoryList() {
	const [storyList, recompute] = useInstanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Story));
	const { setStoryList } = useProducer<RootProducer>();

	useEffect(() => {
		setStoryList(storyList);
	}, [storyList]);
}
