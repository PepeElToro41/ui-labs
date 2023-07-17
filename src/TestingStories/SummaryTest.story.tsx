import Roact from "@rbxts/roact";
import { SpecialControls, WithControls } from "@rbxts/ui-labs";

const controls = {
	"Text Label": "String test",
	Rounded: true,
	"Text Color": Color3.fromRGB(255, 255, 255),
	"Text Size": identity<SpecialControls["Slider"]>({
		ControlType: "Slider",
		Default: 30,
		Props: {
			Min: 20,
			Max: 60,
			Step: 5,
		},
	}),
};

const returner: WithControls<typeof controls> = {
	summary:
		'This is a story to test UI-Labs for Roact Stories, yes, Roact Stories :))\n\nAnd this supports <b>Rich Text</b> :DD \n\n<font color="#FF00FF">RICH TEXT</font>',
	roact: Roact,
	controls: controls,
	story: (props) => {
		return (
			<frame
				Size={UDim2.fromOffset(300, 120)}
				BackgroundColor3={Color3.fromRGB(59, 59, 59)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uicorner CornerRadius={props.Controls.Rounded ? new UDim(0.4, 0) : new UDim(0, 0)}></uicorner>
				<textlabel
					TextColor3={props.Controls["Text Color"]}
					TextSize={props.Controls["Text Size"] * 0.5}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Text={props.Controls["Text Label"]}
				></textlabel>
			</frame>
		);
	},
};

export = returner;
