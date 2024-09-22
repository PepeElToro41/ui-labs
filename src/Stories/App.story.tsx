import { FunctionStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import App from "UI/App";

const story: FunctionStory = (target) => {
	return Vide.mount(() => <App />, target);
};

export = story;
