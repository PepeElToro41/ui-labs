import { useUnmountEffect, lerp } from "@rbxts/pretty-react-hooks";
import { useProducer } from "@rbxts/react-reflex";
import React, { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
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
import { GetContrastColor } from "../../Datatypes/Color3";

const BUBBLE_INFO = new TweenInfo(0.25, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function RGBAControl(props: ControlElementProps<AdvancedTypes.RGBA>) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(BUBBLE_INFO, 0);
	const [udim, setUdim] = useBinding<[pos: Vector2, size: Vector2]>([Vector2.zero, Vector2.zero]);
	const [pickerEnabled, setPickerEnabled] = useState(false);

	const { setPopup, resetPopup } = useProducer<RootProducer>();
	const getPosition = usePosition();

	const OnPickerClose = useCallback(() => {
		setPickerEnabled(false);
	}, []);
	const OnApply = useCallback((value: PickedValue) => props.Apply({ Color: value.Color, Transparency: 1 - value.Alpha }), [props.Apply]);

	const OnColorEdit = useCallback(() => {
		setPickerEnabled(true);
		setPopup(
			"ColorEdit",
			<ColorPicker
				StartColor={props.Current.Color}
				ApplyColor={OnApply}
				StartAlpha={1 - props.Current.Transparency}
				OnClickClose={OnPickerClose}
				Position={udim.map((transform) => {
					const fixedPos = getPosition(transform[0]);
					const centerPos = fixedPos.add(transform[1].div(2));
					return UDim2.fromOffset(centerPos.X - 22, centerPos.Y);
				})}
			/>,
		);
	}, [props.Current, OnApply, OnPickerClose, getPosition]);
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
			<Div
				key={"ColorEntry"}
				Size={hoverAlpha.map((a) => UDim2.fromOffset(lerp(25, 70, a), 25))}
				Change={{
					AbsolutePosition: OnUDimApply,
					AbsoluteSize: OnUDimApply,
				}}
			>
				<imagelabel
					Image={"rbxassetid://14013491588"}
					Position={new UDim2(0, 1, 0, 1)}
					ScaleType={Enum.ScaleType.Tile}
					Size={new UDim2(1, -2, 1, -2)}
					TileSize={new UDim2(0, 10, 0, 10)}
					ZIndex={-2}
				>
					<Rounder />
				</imagelabel>
				<frame
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={props.Current.Color}
					BackgroundTransparency={props.Current.Transparency}
					ZIndex={-1}
				>
					<Rounder />
				</frame>
				<Detector
					ZIndex={2}
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnColorEdit,
					}}
				/>
				<Text
					key="HexLabel"
					AnchorPoint={new Vector2(0.5, 0)}
					Position={new UDim2(0.5, 0, 0, 1)}
					Size={new UDim2(1, -10, 1, 0)}
					ClipsDescendants={true}
					Text={"#" + props.Current.Color.ToHex().upper()}
					TextColor3={GetContrastColor(props.Current.Color)}
					TextTransparency={hoverAlpha.map((a) => 1 - a)}
					TextSize={12}
				/>
				<Sprite
					key={"PickerIcon"}
					Sprite={"Picker"}
					ImageProps={{
						AnchorPoint: new Vector2(0.5, 0.5),
						Position: UDim2.fromScale(0.5, 0.5),
						ImageColor3: GetContrastColor(props.Current.Color),
						ImageTransparency: hoverAlpha,
						Size: new UDim2(0, 20, 0, 20),
					}}
				/>
			</Div>
			<Sprite
				key={"PickerIcon"}
				Sprite={"Picker"}
				ImageProps={{ ImageTransparency: hoverAlpha.map((a) => 1 - a), Size: new UDim2(0, 20, 0, 20) }}
			/>
		</Div>
	);
}

export default RGBAControl;
