import Configs from "Plugin/Configs";
import { instanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";
import { useEffect } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";

export function controlStoryList() {
	const [storyList, recompute] = instanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Story));

	const { setStoryList } = useProducer<RootProducer>();

	useEffect(() => {
		setStoryList(storyList);
	}, [storyList]);
}
