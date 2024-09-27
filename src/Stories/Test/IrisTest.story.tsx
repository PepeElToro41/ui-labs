import Iris, { ShowDemoWindow } from "@rbxts/iris";
import { CreateIrisStory } from "@rbxts/ui-labs";

const controls = {
	test: false,
	test2: 50,
};

const story = CreateIrisStory({ iris: Iris, controls }, (props) => {
	Iris.Connect(() => {
		ShowDemoWindow();
	});
});

export = story;
