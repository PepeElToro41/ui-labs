import Configs from "Plugin/Configs";
import { useInstanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";
import { useProducer } from "@rbxts/react-reflex";
import { useEffect } from "@rbxts/roact";

export function controlStorybookList() {
	const [storybookList, recompute] = useInstanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Storybook));

	const { setStorybookList } = useProducer<RootProducer>();

	useEffect(() => {
		setStorybookList(storybookList);
	}, [storybookList]);
}
