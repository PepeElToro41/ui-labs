import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { Text } from "UI/UIUtils/Styles/Text";
import { _EnumListType } from "@rbxts/ui-labs/out/ControlsUtil";

interface ChooseControlProps extends Control.ControlType<_EnumListType> {}

function setProps(props: ChooseControlProps) {
	return props;
}

function ChooseControlCreate(setprops: ChooseControlProps) {
	const props = identity<Required<ChooseControlProps>>(setProps(setprops) as Required<ChooseControlProps>);
	print(props.Control.Bind.Current);
	return (
		<frame BackgroundColor3={Color3.fromRGB(25, 25, 25)} BorderSizePixel={0} Size={new UDim2(0, 150, 0, 25)}>
			<uicorner CornerRadius={new UDim(0, 6)} />
			<uistroke Color={Color3.fromRGB(255, 255, 255)} Transparency={0.8} />
			<Text
				Key="Selected"
				BackgroundTransparency={1}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
				Position={new UDim2(0, 8, 0, 0)}
				Size={new UDim2(1, -33, 1, 0)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={12}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<imagelabel
				Key="Drop"
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://13941267944"
				ImageRectOffset={new Vector2(192, 128)}
				ImageRectSize={new Vector2(64, 64)}
				Position={new UDim2(1, -5, 0.5, 0)}
				Size={new UDim2(0, 15, 0, 15)}
			/>
		</frame>
	);
}
const ChooseControl = withHooks(ChooseControlCreate);

export = ChooseControl;
