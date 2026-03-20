import { useEffect } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import Configs from "Plugin/Configs";

import { useInstanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";

export function controlStorybookList() {
	const [storybookList, recompute] = useInstanceSearch(
		"ModuleScript",
		ExtensionPredicator(Configs.Extensions.Storybook)
	);

	const { setStorybookList } = useProducer<RootProducer>();

	useEffect(() => {
		setStorybookList(storybookList);
	}, [storybookList]);
}
