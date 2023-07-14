import Roact from "@rbxts/roact";
import SideBar from "../UI/Main/SideBar";

export = function (target: ScreenGui) {
	const NewSideBar = Roact.createElement(SideBar, {
		OnAddResize: (size: number) => {},
	});

	const Handler = Roact.mount(NewSideBar, target);
	return () => {
		Roact.unmount(Handler);
	};
};
