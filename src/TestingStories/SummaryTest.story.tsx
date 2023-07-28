import Roact from "@rbxts/roact";
import { SpecialControls, WithControls } from "@rbxts/ui-labs";
import { EnumList, Number, RGBA } from "@rbxts/ui-labs/out/ControlsUtil";

const controls = {
	"Text Label": "String test",
	Rounded: true,
	EnumList: EnumList(
		{
			Small: 10,
			Medium: 15,
			Large: 20,
		},
		"Medium",
	),
	"Text Color": EnumList(
		{
			White: Color3.fromRGB(255, 255, 255),
			Red: Color3.fromRGB(230, 115, 115),
			Green: Color3.fromRGB(129, 199, 132),
			Blue: Color3.fromRGB(100, 181, 246),
		},
		"White",
	),
	"Back Color": RGBA(Color3.fromRGB(59, 59, 59), 0),
	//"Text Color": Color3.fromRGB(255, 255, 255),
	//"Back Color": Color3.fromRGB(59, 59, 59),
	"Box Size": Number(200, new NumberRange(5, 400), 1, true),
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
				Size={UDim2.fromOffset(props.Controls["Box Size"], 120)}
				BackgroundColor3={props.Controls["Back Color"].Color}
				Position={UDim2.fromScale(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundTransparency={props.Controls["Back Color"].Transparency}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uicorner
					CornerRadius={props.Controls.Rounded ? new UDim(0, props.Controls.EnumList) : new UDim(0, 0)}
				></uicorner>
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
