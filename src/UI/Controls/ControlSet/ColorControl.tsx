import { Spring, useMotor, useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Sprite } from "UI/UIUtils/Sprite";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Image } from "UI/UIUtils/Styles/Image";
import { Text } from "UI/UIUtils/Styles/Text";

interface ColorControlProps extends Control.ControlType<Color3> {}

function setProps(props: ColorControlProps) {
	return props;
}

function GetContrastColor(color: Color3) {
	const totalContrast = (color.R * 255 + color.G * 255 + color.B * 255) / 3;
	if (totalContrast > 255 / 2) {
		return new Color3(0, 0, 0);
	} else {
		return new Color3(1, 1, 1);
	}
}

function ColorControlCreate(setprops: ColorControlProps) {
	const props = identity<Required<ColorControlProps>>(setProps(setprops) as Required<ColorControlProps>);
	const [color, setColor] = useState(props.Default);
	const [hovered, setHover] = useState(false);
	const [propsMotor, setPropsMotor] = useMotor({
		ColorSize: 24,
		Transparency: 1,
	});
	useUpdateEffect(() => {
		if (hovered) {
			setPropsMotor({
				ColorSize: new Spring(74),
				Transparency: new Spring(0),
			});
		} else {
			setPropsMotor({
				ColorSize: new Spring(24),
				Transparency: new Spring(1),
			});
		}
	}, [hovered]);
	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<frame
				Key="ColorFrame"
				BackgroundColor3={color}
				BorderSizePixel={0}
				Size={propsMotor.map(({ ColorSize }) => new UDim2(0, ColorSize, 0, 24))}
			>
				<Detector
					Key="Detector"
					Event={{
						MouseEnter: () => setHover(true),
						MouseLeave: () => setHover(false),
					}}
				></Detector>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<Text
					Key="HexLabel"
					AnchorPoint={new Vector2(0.5, 0)}
					Position={new UDim2(0.5, 0, 0, 1)}
					Size={new UDim2(1, -10, 1, 0)}
					ClipsDescendants={true}
					Text={"#" + color.ToHex().upper()}
					TextColor3={GetContrastColor(color)}
					TextTransparency={propsMotor.map(({ Transparency }) => Transparency)}
					TextSize={12}
				/>
			</frame>
			<Sprite
				Key="Picker"
				ImageTransparency={propsMotor.map(({ Transparency }) => Transparency)}
				LayoutOrder={1}
				ImageRectOffset={new Vector2(256, 0)}
				Size={new UDim2(0, 20, 0, 20)}
			/>
		</>
	);
}
const ColorControl = withHooks(ColorControlCreate);

export = ColorControl;
