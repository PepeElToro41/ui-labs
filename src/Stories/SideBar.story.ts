import Roact from "@rbxts/roact";
import SideBar from "../UI/Main/SideBar";

export = function (target: ScreenGui) {
	const NewSideBar = Roact.createElement(SideBar, {
		OnSelectStory: (story: StoryNode) => {},
	});

	const Handler = Roact.mount(NewSideBar, target);
	return function () {
		Roact.unmount(Handler);
	};
};
