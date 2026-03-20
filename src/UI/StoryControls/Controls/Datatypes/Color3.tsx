import { lerp, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { DatatypeControl } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { usePosition } from "Hooks/Utils/AppHolder";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import ColorPicker, { PickedValue } from "UI/Overlays/ColorPicker";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";
import { FixColor3, GetColorHex } from "Utils/MiscUtils";

export function GetContrastColor(rawColor: Color3) {
	const color = FixColor3(rawColor);

	const totalContrast = (color.R * 255 + color.G * 255 + color.B * 255) / 3;
	if (totalContrast > 255 / 2) {
		return new Color3(0.13, 0.13, 0.13);
	} else {
		return new Color3(1, 1, 1);
	}
}

const BUBBLE_INFO = new TweenInfo(0.25, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function Color3Control(props: ControlElementProps<DatatypeControl<"Color3">>) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(BUBBLE_INFO, 0);
	const [udim, setUdim] = useBinding<[pos: Vector2, size: Vector2]>([Vector2.zero, Vector2.zero]);
	const [pickerEnabled, setPickerEnabled] = useState(false);

	const { setPopup, resetPopup } = useProducer<RootProducer>();
	const getPosition = usePosition();

	const OnPickerClose = useCallback(() => {
		setPickerEnabled(false);
	}, []);
	const OnApply = useCallback((val: PickedValue) => props.Apply(val.Color), [props.Apply]);

	const OnColorEdit = useCallback(() => {
		setPickerEnabled(true);
		setPopup(
			"ColorEdit",
			<ColorPicker
				StartColor={props.Current}
				ApplyColor={OnApply}
				OnClickClose={OnPickerClose}
				Position={udim.map((transform) => {
					const fixedPos = getPosition(transform[0]);
					const centerPos = fixedPos.add(transform[1].div(2));
					return UDim2.fromOffset(centerPos.X - 22, centerPos.Y);
				})}
			/>
		);
	}, [props.Current, props.Apply, OnPickerClose, getPosition]);
	const OnUDimApply = useCallback((frame: Frame) => {
		setUdim([frame.AbsolutePosition, frame.AbsoluteSize]);
	}, []);
	useUnmountEffect(() => {
		if (pickerEnabled) {
			resetPopup();
		}
	});
	useEffect(() => {
		tweenHoverAlpha(hovered || pickerEnabled ? 1 : 0);
	}, [hovered, pickerEnabled]);

	return (
		<Div>
			<LeftList Padding={new UDim(0, 6)} VerticalAlignment={Enum.VerticalAlignment.Center} />
			<frame
				key={"ColorEntry"}
				BackgroundColor3={props.Current}
				Size={hoverAlpha.map((a) => UDim2.fromOffset(lerp(25, 70, a), 25))}
				BorderSizePixel={0}
				Change={{
					AbsolutePosition: OnUDimApply,
					AbsoluteSize: OnUDimApply
				}}
			>
				<Rounder />
				<Detector
					ZIndex={2}
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnColorEdit
					}}
				/>
				<Text
					key="HexLabel"
					AnchorPoint={new Vector2(0.5, 0)}
					Position={new UDim2(0.5, 0, 0, 1)}
					Size={new UDim2(1, -10, 1, 0)}
					ClipsDescendants={true}
					Text={"#" + GetColorHex(props.Current).upper()}
					TextColor3={GetContrastColor(props.Current)}
					TextTransparency={hoverAlpha.map((a) => 1 - a)}
					TextSize={12}
				/>
				<Sprite
					key={"PickerIcon"}
					Sprite={"Picker"}
					ImageProps={{
						AnchorPoint: new Vector2(0.5, 0.5),
						Position: UDim2.fromScale(0.5, 0.5),
						ImageColor3: GetContrastColor(props.Current),
						ImageTransparency: hoverAlpha,
						Size: new UDim2(0, 20, 0, 20)
					}}
				/>
			</frame>
			<Sprite
				key={"PickerIcon"}
				Sprite={"Picker"}
				ImageProps={{ ImageTransparency: hoverAlpha.map((a) => 1 - a), Size: new UDim2(0, 20, 0, 20) }}
			/>
		</Div>
	);
}

export default Color3Control;
