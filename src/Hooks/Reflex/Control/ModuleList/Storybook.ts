import Configs from "Plugin/Configs";
import { instanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";
import { useEffect } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";

export function controlStorybookList() {
	const [storybookList, recompute] = instanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Storybook));

	const { setStorybookList } = useProducer<RootProducer>();

	useEffect(() => {
		setStorybookList(storybookList);
	}, [storybookList]);
}
