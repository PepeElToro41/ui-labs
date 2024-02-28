import Roact, { useBinding, useCallback, useEffect, useState } from "@rbxts/roact";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import ColorPointer from "./ColorPointer";
import Padding from "UI/Styles/Padding";
import ValuePicker from "./ValuePicker";
import HueBar from "./HueBar";
import ColorEntry from "./ColorEntry";
import { ColorDecoders, ColorParsers } from "./ColorEntry/Utils";
import { useToggler } from "Hooks/Utils/Toggler";
import { useProducer } from "@rbxts/react-reflex";
import { useInputBegan } from "Hooks/Context/UserInput";
import { useConnection } from "Hooks/Utils/Connection";
import { useUnmountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { GetVector, useOutsideCheck } from "Hooks/Utils/OutsideWrapper";
import { RunService } from "@rbxts/services";
import { Counter } from "Utils/NumberUtils";
import AlphaBar from "./AlphaBar";

export interface PickedValue {
	Color: Color3;
	Alpha: number;
}

interface ColorPickerProps {
	StartColor: Color3;
	ApplyColor: (value: PickedValue) => void;
	StartAlpha?: number;
	Position?: UDim2 | Roact.Binding<UDim2>;
	Separation?: number;
	OnClickClose?: () => void;
}

export interface HSV {
	H: number;
	S: number;
	V: number;
}

function GetHSVValues(color: Color3): HSV {
	const [h, s, v] = color.ToHSV();
	return {
		H: h === 1 ? 0 : h,
		S: s,
		V: v,
	};
}

function ColorPicker(props: ColorPickerProps) {
	const [color, setColor] = useState(props.StartColor);
	const [alpha, setAlpha] = useState(props.StartAlpha ?? 1);
	const [hsv, setHSV] = useBinding(GetHSVValues(color));
	const [inside, insideApi] = useToggler(false);
	const [size, setSize] = useBinding(Vector2.zero);
	const [wrapped, setWrapped] = useState(false);

	const count = Counter();

	const OutsideCheck = useOutsideCheck(props.Position ?? Vector2.zero, size);
	const { resetOverlay } = useProducer<RootProducer>();
	const inputBegan = useInputBegan();

	const OnApplyColor = useCallback((color: Color3) => {
		setHSV(GetHSVValues(color));
		setColor(color);
	}, []);
	const SetHSV = useCallback((values: Partial<HSV>) => {
		const oldValues = hsv.getValue();
		const newValues = { ...oldValues, ...values };
		setHSV(newValues);
		setColor(Color3.fromHSV(newValues.H, newValues.S, newValues.V));
	}, []);
	const OnAbsoluteSizeChanged = useCallback((frame: Frame) => {
		setSize(frame.AbsoluteSize);
	}, []);
	useEffect(() => {
		const connection = RunService.PreRender.Connect(() => {
			const isOutside = OutsideCheck(new Vector2(0, 1), "Y");
			setWrapped(isOutside);
		});
		return () => connection.Disconnect();
	}, [OutsideCheck]);

	useConnection(
		inputBegan,
		(input) => {
			if (!inside && input.UserInputType === Enum.UserInputType.MouseButton1) {
				resetOverlay();
			}
		},
		[inside],
	);

	useUnmountEffect(() => {
		if (props.OnClickClose) {
			props.OnClickClose();
		}
	});
	useUpdateEffect(() => {
		OnApplyColor(props.StartColor);
	}, [props.StartColor]);
	useEffect(() => {
		props.ApplyColor({ Color: color, Alpha: alpha });
	}, [color, alpha]);

	return (
		<Div
			Size={UDim2.fromOffset(145, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={props.Position ?? UDim2.fromScale(0, 0)}
			AnchorPoint={new Vector2(0, wrapped ? 0 : 1)}
			Change={{
				AbsoluteSize: OnAbsoluteSizeChanged,
			}}
		>
			<TopList />
			<frame
				Key={"Picker"}
				Size={UDim2.fromScale(1, 0)}
				BackgroundColor3={Color3.fromRGB(24, 24, 24)}
				AutomaticSize={Enum.AutomaticSize.Y}
				LayoutOrder={1}
				Event={{
					MouseEnter: insideApi.enable,
					MouseLeave: insideApi.disable,
				}}
			>
				<uistroke Color={Color3.fromRGB(150, 150, 150)} Transparency={0.8} />
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} />
				<Corner Radius={6} />
				<Div Key={"Contents"} Size={new UDim2(1, 0, 0, 0)} LayoutOrder={1} AutomaticSize={Enum.AutomaticSize.Y}>
					<TopList Padding={new UDim(0, 7)} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
					<Padding Padding={6} />
					<ValuePicker HSV={hsv} SetHSV={SetHSV} Order={count()} />
					<HueBar HSV={hsv} SetHSV={SetHSV} Order={count()} />
					{props.StartAlpha !== undefined ? (
						<AlphaBar Alpha={alpha} OnApply={setAlpha} Color={color} Order={count()} />
					) : undefined}
					<ColorEntry
						Title="Hex"
						Value={color}
						Parser={ColorParsers.Hex}
						Decoder={ColorDecoders.Hex}
						Apply={OnApplyColor}
						Order={count()}
					/>
					<ColorEntry
						Title="RGB"
						Value={color}
						Parser={ColorParsers.RGB}
						Decoder={ColorDecoders.RBG}
						Apply={OnApplyColor}
						Order={count()}
					/>
					{props.StartAlpha !== undefined ? (
						<ColorEntry
							Title="Alpha"
							Value={alpha}
							Parser={ColorParsers.Alpha}
							Decoder={ColorDecoders.Alpha}
							Apply={setAlpha}
							Order={count()}
						/>
					) : undefined}
				</Div>
				<ColorPointer Color={color} Order={wrapped ? 0 : 2} Wrapped={wrapped} />
			</frame>
			<Div Key={"Separator"} Size={new UDim2(1, 0, 0, props.Separation ?? 20)} LayoutOrder={wrapped ? 0 : 2} />
		</Div>
	);
}
export default ColorPicker;
