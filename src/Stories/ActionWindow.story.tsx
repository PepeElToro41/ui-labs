import Roact from "@rbxts/roact";
import { PrimitiveControls } from "Declarations/StoryPreview";
import ActionWindow from "UI/Actions/ActionWindow";
import { CreateWindow } from "UI/Actions/WindowMap";

export = function (target: ScreenGui) {
	const NewActionWindow = (
		<ActionWindow
			Key="ActionWindow"
			ActiveWindows={[
				CreateWindow("Summary", {
					StoryName: "This is a story name",
					Summary:
						"This is a summary, This summary should support <b>Rich text</b>, and should be able to be as long as it needs to be \n" +
						'\n\n<font color="#00FFFF">RICH</font> <font color="#FFFF00">TEXT</font>' +
						'\n\n<font size="30"> RICH TEXT</font>',
				}),
				CreateWindow("Controls", {
					Controls: {
						"String Control Test": identity<PrimitiveControls["string"]>({
							ControlType: "string",
							Default: "",
						}),
						"Number Control Test": identity<PrimitiveControls["number"]>({
							ControlType: "number",
							Default: 5,
						}),
						"Boolean Control Test": identity<PrimitiveControls["boolean"]>({
							ControlType: "boolean",
							Default: true,
						}),
					},
				}),
			]}
		></ActionWindow>
	);
	const Handler = Roact.mount(NewActionWindow, target, "ActionWindow");
	return function () {
		Roact.unmount(Handler);
	};
};
