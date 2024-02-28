import Configs from "Plugin/Configs";
import { useInstanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";
import { useProducer } from "@rbxts/react-reflex";
import { useEffect } from "@rbxts/roact";

export function controlStoryList() {
	const [storyList, recompute] = useInstanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Story));
	const { setStoryList } = useProducer<RootProducer>();

	useEffect(() => {
		setStoryList(storyList);
	}, [storyList]);
}
