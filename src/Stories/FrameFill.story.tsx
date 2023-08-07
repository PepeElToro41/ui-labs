import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { Number } from "@rbxts/ui-labs/out/ControlsUtil";
import FrameFill from "UI/Holders/FrameFill";

const controls = {
	PosX: Number(50, new NumberRange(0, 250), 1, true, 100),
	PosY: Number(50, new NumberRange(0, 175), 1, true, 100),
};

const returnStory: WithControls<typeof controls> = {
	roact: Roact,
	controls: controls,
	story: (props) => {
		return (
			<frame
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(0, 255, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromOffset(300, 200)}
			>
				<FrameFill
					FillDir="XY"
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
					FrameProps={{
						Position: new UDim2(0, props.controls.PosX, 0, props.controls.PosY),
						BackgroundTransparency: 0.5,
						BackgroundColor3: Color3.fromRGB(255, 0, 0),
					}}
				></FrameFill>
			</frame>
		);
	},
};

export = returnStory;
