import { loggerMiddleware } from "@rbxts/reflex";
import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/roact-reflex";
import { FunctionalStory, WithControls } from "@rbxts/ui-labs";
import { RootProducer } from "Reflex";
import App from "UI/App";

//I use hoarcekat to visualize UI-Labs because it's weird to visualize the plugin with itself

const story: FunctionalStory = (target) => {
	const component = (
		<ReflexProvider producer={RootProducer}>
			<App></App>
		</ReflexProvider>
	);
	const handle = Roact.mount(component, target);
	return () => {
		Roact.unmount(handle);
	};
};

export = story;
