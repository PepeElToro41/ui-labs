import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { Choose, Number } from "@rbxts/ui-labs/out/ControlsUtil";
import ResizableFrame from "UI/Holders/ResizableFrame";

const controls = {
	SizeX: Number(100, new NumberRange(50, 300), 1, true, 100),
	SizeY: Number(50, new NumberRange(50, 300), 1, true, 100),
	HandleAnchor: Choose(["Left", "Right", "Top", "Bottom"]),
	ResizeRange: Number(100, new NumberRange(50, 300), 1, true, 100),
};
const Anchors = {
	Left: new Vector2(1, 0.5),
	Right: new Vector2(0, 0.5),
	Top: new Vector2(0.5, 1),
	Bottom: new Vector2(0.5, 0),
};

const returnStory: WithControls<typeof controls> = {
	roact: Roact,
	controls: controls,
	story: (props) => {
		return (
			<ResizableFrame
				BaseSize={new UDim2(0, 300, 0, 300)}
				ResizeRange={new NumberRange(-200, 200)}
				MaxBeforeCollapse={-250}
				HolderProps={{
					Position: new UDim2(0.2, 0, 0.5, 0),
					AnchorPoint: Anchors[props.controls.HandleAnchor],
				}}
				FrameProps={{
					BackgroundColor3: Color3.fromRGB(255, 255, 255),
					BackgroundTransparency: 0.5,
				}}
				HandleAnchor={props.controls.HandleAnchor}
			></ResizableFrame>
		);
	},
};

export = returnStory;
