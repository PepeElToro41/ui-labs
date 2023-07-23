import { useMotor, useUpdateEffect, useEventListener, Spring } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useBinding, useCallback, useContext, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { OverlayContext } from "UI/Contexts/OverlayContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Sprite } from "UI/UIUtils/Sprite";
import { Detector } from "UI/UIUtils/Styles/Detector";
import PositionBinder from "UI/UIUtils/Styles/PositionBinder";
import { Text } from "UI/UIUtils/Styles/Text";
import { GetContrastColor } from "./ColorControl";

interface IsRGBA {
	Color: Color3;
	Transparency: number;
}

interface RGBAControlProps extends Control.ControlType<IsRGBA> {}

function setProps(props: RGBAControlProps) {
	return props;
}

function RGBAControlCreate(setprops: RGBAControlProps) {
	const props = identity<Required<RGBAControlProps>>(setProps(setprops) as Required<RGBAControlProps>);
	const overlayContext = useContext(OverlayContext);
	const { PickColor } = overlayContext;
	const [color, setColor] = useState(props.Control.Bind.Current as IsRGBA);
	const [hovered, setHover] = useState(false);
	const [posBind, setPosBind] = useBinding(new Vector2());
	const [pickerOpened, setPickerOpened] = useState(false);
	const frameRef = useRef<Frame>();
	const theme = useContext(ThemeContext).Theme;
	const updateUdim = useCallback(() => {
		const frame = frameRef.getValue();
		if (!frame) return;
		const finalPos = frame.AbsolutePosition.add(frame.AbsoluteSize.div(2));
		setPosBind(finalPos.add(new Vector2(-23, 0)));
	}, []);
	const [propsMotor, setPropsMotor] = useMotor({
		ColorSize: 24,
		Transparency: 1,
	});
	const resetControls = () => {
		setColor(props.Default);
	};
	useUpdateEffect(() => {
		resetControls();
	}, [props.Default]);
	useEventListener(props.ResetListen, () => {
		resetControls();
	});
	useUpdateEffect(() => {
		if (hovered || pickerOpened) {
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
	}, [hovered, pickerOpened]);
	useUpdateEffect(() => {
		props.ControlApply(color);
	}, [color]);

	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<PositionBinder
				BindSet={updateUdim}
				Key="ColorFrame"
				BackgroundTransparency={1}
				Size={propsMotor.map(({ ColorSize }) => new UDim2(0, ColorSize, 0, 24))}
				Ref={frameRef}
			>
				<frame
					Key="ColorLabel"
					BackgroundColor3={color.Color}
					BackgroundTransparency={color.Transparency}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={2}
				>
					<uicorner CornerRadius={new UDim(0.5, 0)} />
				</frame>
				<imagelabel
					Key="AlphaPattern"
					BackgroundTransparency={1}
					Image="rbxassetid://14013491588"
					Position={new UDim2(0, 1, 0, 1)}
					ScaleType={Enum.ScaleType.Tile}
					Size={new UDim2(1, -2, 1, -2)}
					TileSize={new UDim2(0, 10, 0, 10)}
				>
					<uicorner CornerRadius={new UDim(0.5, 0)} />
				</imagelabel>
				<Detector
					Key="Detector"
					ZIndex={4}
					Event={{
						MouseEnter: () => setHover(true),
						MouseLeave: () => setHover(false),
						MouseButton1Click: () => {
							PickColor(
								color.Color,
								posBind,
								(newColor) => setColor((oldColor) => ({ ...oldColor, Color: newColor })),
								() => setPickerOpened(false),
								1 - color.Transparency,
								(newAlpha) => setColor((oldColor) => ({ ...oldColor, Transparency: 1 - newAlpha })),
							);
							setPickerOpened(true);
						},
					}}
				></Detector>
				<Text
					Key="HexLabel"
					AnchorPoint={new Vector2(0.5, 0)}
					Position={new UDim2(0.5, 0, 0, 1)}
					Size={new UDim2(1, -10, 1, 0)}
					ClipsDescendants={true}
					Text={"#" + color.Color.ToHex().upper()}
					TextColor3={GetContrastColor(color.Color)}
					TextTransparency={propsMotor.map(({ Transparency }) => Transparency)}
					TextSize={12}
					ZIndex={3}
				/>
			</PositionBinder>
			<Sprite
				Key="Picker"
				ImageColor3={theme.IconsColor}
				ImageTransparency={propsMotor.map(({ Transparency }) => Transparency)}
				LayoutOrder={1}
				ImageRectOffset={new Vector2(256, 0)}
				Size={new UDim2(0, 20, 0, 20)}
			/>
		</>
	);
}
const RGBAControl = withHooks(RGBAControlCreate);

export = RGBAControl;
