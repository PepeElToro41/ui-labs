import Roact from "@rbxts/roact";
import { SpecialControls, WithControls } from "@rbxts/ui-labs";
import { Choose, EnumList, Number, RGBA, Slider } from "@rbxts/ui-labs/out/ControlsUtil";

const controls = {
	"Text Label": "String test",
	Rounded: true,
	ChooseList: Choose(["One", "Two", "Three"]),
	"Text Color": EnumList(
		{
			White: Color3.fromRGB(255, 255, 255),
			Red: Color3.fromRGB(230, 115, 115),
			Green: Color3.fromRGB(129, 199, 132),
			Blue: Color3.fromRGB(100, 181, 246),
		},
		"White",
	),
	RoundSize: EnumList(
		{
			Small: new UDim(0, 10),
			Medium: new UDim(0, 20),
			Large: new UDim(0, 30),
		},
		"Small",
	),
	"Back Color": RGBA(Color3.fromRGB(59, 59, 59), 0),
	//"Text Color": Color3.fromRGB(255, 255, 255),
	//"Back Color": Color3.fromRGB(59, 59, 59),
	"Box Size": Number(200, new NumberRange(5, 400), 1, true),
	"Text Size": Slider(30, 20, 60, 5),
};

const returner: WithControls<typeof controls> = {
	summary:
		'This is a story to test UI-Labs for Roact Stories, yes, Roact Stories :))\n\nAnd this supports <b>Rich Text</b> :DD \n\n<font color="#FF00FF">RICH TEXT</font>',
	roact: Roact,
	controls: controls,
	story: (props) => {
		return (
			<frame
				Size={UDim2.fromOffset(props.controls["Box Size"], 120)}
				BackgroundColor3={props.controls["Back Color"].Color}
				Position={UDim2.fromScale(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundTransparency={props.controls["Back Color"].Transparency}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uicorner CornerRadius={props.controls.Rounded ? props.controls.RoundSize : new UDim(0, 0)}></uicorner>
				<textlabel
					TextColor3={props.controls["Text Color"]}
					TextSize={props.controls["Text Size"] * 0.5}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Text={props.controls["Text Label"]}
				></textlabel>
			</frame>
		);
	},
};

export = returner;
