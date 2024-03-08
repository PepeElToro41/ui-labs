import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import App from "UI/App";
import { createLegacyRoot, createRoot } from "@rbxts/react-roblox";
import { FunctionStory } from "@rbxts/ui-labs";

//I use hoarcekat to visualize UI-Labs because it's weird to visualize the plugin with itself

const story: FunctionStory = (target) => {
	const component = (
		<ReflexProvider producer={RootProducer}>
			<App></App>
		</ReflexProvider>
	);
	const root = createLegacyRoot(target);
	root.render(component);
	return () => {
		root.unmount();
	};
};

export = story;
