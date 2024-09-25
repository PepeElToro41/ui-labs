import { FunctionStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import App from "UI/App";

Vide.strict = false;

const story: FunctionStory = (target) => {
	const unmount = Vide.mount(() => <App />, target);
	return () => {
		unmount();
	};
};

export = story;
