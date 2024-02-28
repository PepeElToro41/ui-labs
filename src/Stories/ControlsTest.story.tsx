import Roact from "@rbxts/roact";
import { Boolean, Choose, ControlGroup, CreateReactStory, EnumList, Number, Object, RGBA, Slider, String } from "@rbxts/ui-labs";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import Padding from "UI/Styles/Padding";
import ReactRoblox from "@rbxts/react-roblox";
import Corner from "UI/Styles/Corner";
import Rounder from "UI/Styles/Rounder";

const controls = {
	NumberControl: Number(100, undefined, undefined, 5),
	StringControl: String("asd"),
	BoolControl: Boolean(false),
	ColorControl: Color3.fromRGB(255, 255, 255),
	RGBAControl: RGBA(new Color3(0.8, 0.4, 1), 0.9),
	SliderControl: Slider(5, 1, 10, 1),

	ChooseControl: Choose([1, 2, 3, 4, 5], 0),
	EnumControl: EnumList({ V1: "S1", V2: "S2", V3: "S3" }, "V3"),

	InstanceControl: Object("Model"),

	Group: ControlGroup({
		Substring: String("Hello UwU"),
		ColorControl: Color3.fromRGB(255, 255, 255),
		Instance: Object("Accessory"),
	}),
};

const story = CreateReactStory({ controls: controls, react: Roact, reactRoblox: ReactRoblox }, (props) => {
	return (
		<frame
			Size={UDim2.fromOffset(100, 100)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={props.controls.ColorControl}
		>
			<Padding Padding={15} />
			<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={props.controls.Group.ColorControl}>
				<frame
					BackgroundColor3={props.controls.RGBAControl.Color}
					BackgroundTransparency={props.controls.RGBAControl.Transparency}
					Size={UDim2.fromOffset(30, 30)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
				>
					<Rounder />
				</frame>
			</frame>
		</frame>
	);
});
export = story as any as {};
