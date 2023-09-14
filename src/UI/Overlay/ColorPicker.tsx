import { useBindingListener, useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useBinding, useCallback, useContext, useEffect, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { OverlayContext } from "UI/Contexts/OverlayContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import SlideDrag from "UI/UIUtils/Draggers/SlideDrag";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Div } from "UI/UIUtils/Styles/Div";
import PositionBinder from "UI/UIUtils/Styles/PositionBinder";

interface ColorPickerProps {
	StartColor: Color3;
	AlphaChanel?: number;
	Position: Roact.Binding<UDim2>;
	CanvasBind: Roact.Binding<[Vector2, Vector2]>;
	ColorApply: (color: Color3) => void;
	AlphaApply?: (alpha: number) => void;
	SelfClose: () => void;
}

const alphaLight = "rbxassetid://14013453480";
const alphaDark = "rbxassetid://14013491588";

function setProps(props: ColorPickerProps) {
	return props;
}
type Widen<T> = T extends number ? number : T;

type DecoderFn<T extends Color3 | number> = (text: string, oldColor: Widen<T>) => Widen<T>;
type ParserFn<T extends Color3 | number> = (color: Widen<T>) => string;

const Parsers = {
	Hex: (color: Color3) => {
		return "#" + color.ToHex().upper();
	},
	RGB: (color: Color3) => {
		return `${math.floor(color.R * 255)} ,${math.floor(color.G * 255)} ,${math.floor(color.B * 255)}`;
	},
	Alpha: (alpha: number) => {
		return tostring(math.floor(alpha * 100) / 100);
	},
};
const Decoders = {
	Hex: (hexInput: string, oldColor: Color3) => {
		hexInput = hexInput.gsub("#", "")[0];
		const [sucess, decompiled] = pcall(() => Color3.fromHex(hexInput));
		if (sucess) {
			return decompiled;
		} else {
			return oldColor;
		}
	},
	RBG: (rbgInput: string, oldColor: Color3) => {
		const rgbStr = rbgInput.gsub(" ", "")[0].split(",");
		let isRBGValid = true;
		rgbStr.forEach((v) => {
			if (tonumber(v) === undefined) isRBGValid = false;
		});
		if (rgbStr.size() === 3 && isRBGValid) {
			const rgbValues = {
				R: math.clamp(math.floor(tonumber(rgbStr[0])!), 0, 255),
				G: math.clamp(math.floor(tonumber(rgbStr[1])!), 0, 255),
				B: math.clamp(math.floor(tonumber(rgbStr[2])!), 0, 255),
			};
			return Color3.fromRGB(rgbValues.R, rgbValues.G, rgbValues.B);
		}
		return oldColor;
	},
	Alpha: (alphaInput: string, oldAlpha: number) => {
		const alpha = tonumber(alphaInput);
		if (alpha !== undefined) {
			return math.clamp(alpha, 0, 1);
		}
		return oldAlpha;
	},
};

function Entry<T extends Color3 | number>(props: {
	Value: Widen<T>;
	LayoutOrder: number;
	Text: string;
	Parser: ParserFn<T>;
	Decoder: DecoderFn<T>;
	Applier: (Color: Widen<T>) => void;
	Theme: Theme;
}) {
	const theme = props.Theme;
	return (
		<frame
			Key="Holder"
			BackgroundTransparency={1}
			LayoutOrder={props.LayoutOrder}
			Position={new UDim2(0, 0, 0, 105)}
			Size={new UDim2(1, 0, 0, 22)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<textlabel
				Key="EntryName"
				BackgroundTransparency={1}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
				RichText={true}
				Size={new UDim2(0, 40, 1, 0)}
				Text={props.Text}
				TextColor3={theme.TextColor}
				TextSize={12}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<frame Key="Background" BackgroundColor3={theme.SearchInput} BorderSizePixel={0} Size={new UDim2(1, -40, 1, 0)}>
				<uicorner CornerRadius={new UDim(0, 4)} />
				<textbox
					Key="Entry"
					BackgroundTransparency={1}
					TextTruncate={Enum.TextTruncate.AtEnd}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					PlaceholderText={props.Parser(props.Value)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(1, -8, 1, 0)}
					Text={""}
					TextColor3={theme.TextColor}
					PlaceholderColor3={theme.SearchPlaceholder}
					TextSize={11}
					Event={{
						FocusLost: (textBox: TextBox) => {
							const TextValue = textBox.Text;
							textBox.Text = "";
							const Value = props.Decoder(TextValue, props.Value);
							if (props.Applier) {
								props.Applier(Value);
							}
						},
					}}
				/>
			</frame>
		</frame>
	);
}

function GetHandlers(color: Color3) {
	const [hue, saturation, value] = color.ToHSV();
	return {
		hue: hue === 1 ? 0 : hue,
		saturation: saturation,
		value: value,
	};
}

function PredictY(pickerPos: Vector2, pickerSize: Vector2, flipped: boolean) {
	const anchored = new Vector2(0, flipped ? 0 : 1);
	return pickerPos.Y - pickerSize.Y * (anchored.Y * 2 - 1);
}

function ColorPickerCreate(setprops: ColorPickerProps) {
	const props = identity<Required<ColorPickerProps>>(setProps(setprops) as Required<ColorPickerProps>);
	const theme = useContext(ThemeContext).Theme;
	const [color, setColor] = useState(props.StartColor);
	const [handlers, setHandlers] = useState(GetHandlers(color));
	const [alpha, setAlpha] = useState(props.AlphaChanel ?? 1);
	const [flipped, setFlipped] = useState(false);
	const [pickerPosition, setPickerPosition] = useBinding([new Vector2(), new Vector2()]);
	const frameRef = useRef<Frame>();
	const [inside, setInside] = useBinding(false);
	const { OverlayInput } = useContext(OverlayContext);
	const colorApply = useCallback((newColor: Color3) => {
		setColor((oldColor) => {
			if (oldColor === newColor) return oldColor;
			setHandlers(GetHandlers(newColor));
			return newColor;
		});
	}, []);
	const handlersApply = useCallback((newHandlers: ReturnType<typeof GetHandlers>) => {
		const newColor = Color3.fromHSV(newHandlers.hue, newHandlers.saturation, newHandlers.value);
		setHandlers(newHandlers);
		setColor(newColor);
	}, []);
	useEventListener(OverlayInput, (input) => {
		if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
		if (!inside.getValue()) {
			props.SelfClose();
		}
	});
	useEffect(() => {
		props.ColorApply(color);
	}, [color, alpha]);
	useEffect(() => {
		if (!props.AlphaApply) return;
		props.AlphaApply(alpha);
	}, [alpha]);
	const CalculateFlip = useCallback(() => {
		const frame = frameRef.getValue();
		if (!frame) return;
		const [canvasPos] = props.CanvasBind.getValue();
		const [pickerPos, pickerSize] = pickerPosition.getValue();
		const relativePos = pickerPos.sub(canvasPos);
		const finalPos = relativePos.add(pickerSize.mul(frame.AnchorPoint));
		const unflippedY = PredictY(finalPos, pickerSize, false);
		if (flipped === false) {
			if (unflippedY < 0) {
				setFlipped(true);
			}
		} else {
			if (unflippedY > 0) {
				setFlipped(false);
			}
		}
	}, [flipped]);
	useBindingListener(props.CanvasBind, () => CalculateFlip());
	useBindingListener(pickerPosition, () => CalculateFlip());
	return (
		<PositionBinder
			BindSet={setPickerPosition}
			Key="ColorPicker"
			AnchorPoint={new Vector2(0, flipped ? 0 : 1)}
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={props.Position}
			Size={new UDim2(0, 145, 0, 0)}
			Ref={frameRef}
		>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>
			<frame
				Key="Contents"
				AutomaticSize={Enum.AutomaticSize.Y}
				Size={new UDim2(1, 0, 0, 0)}
				BackgroundColor3={theme.ColorPickerWindow}
				BorderSizePixel={0}
				Event={{
					MouseEnter: () => setInside(true),
					MouseLeave: () => setInside(false),
				}}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uistroke Color={theme.Divisor} Transparency={0.8} />
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					FillDirection={Enum.FillDirection.Vertical}
				></uilistlayout>
				<Div Key="Contents" AutomaticSize={Enum.AutomaticSize.Y} BackgroundTransparency={1} Size={new UDim2(1, 0, 0, 0)}>
					<uipadding
						PaddingBottom={new UDim(0, 6)}
						PaddingLeft={new UDim(0, 6)}
						PaddingRight={new UDim(0, 6)}
						PaddingTop={new UDim(0, 6)}
					/>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 8)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<frame
						Key="ValuePicker"
						BackgroundColor3={Color3.fromHSV(handlers.hue, 1, 1)}
						BorderSizePixel={0}
						Size={new UDim2(1, 0, 0, 100)}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
						<frame
							Key="Handle"
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(1 - handlers.saturation, 1 - handlers.value)}
							Size={new UDim2(0, 6, 0, 6)}
							ZIndex={3}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
							<uistroke Color={theme.TextColor} />
						</frame>
						<SlideDrag
							Key="ValueSlider"
							DetectProps={{
								Size: UDim2.fromScale(1, 1),
							}}
							SlideDir="XY"
							PercentApply={(percent) => {
								handlersApply({ hue: handlers.hue, saturation: 1 - percent.X, value: 1 - percent.Y });
							}}
						></SlideDrag>
						<frame
							Key="White"
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BorderSizePixel={0}
							Size={new UDim2(1, 0, 1, 0)}
						>
							<uicorner CornerRadius={new UDim(0, 4)} />
							<uigradient
								Transparency={
									new NumberSequence([new NumberSequenceKeypoint(0, 1, 0), new NumberSequenceKeypoint(1, 0, 0)])
								}
							/>
						</frame>
						<frame
							Key="Black"
							BackgroundColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Size={new UDim2(1, 0, 1, 0)}
							ZIndex={2}
						>
							<uicorner CornerRadius={new UDim(0, 3)} />
							<uigradient
								Rotation={90}
								Transparency={
									new NumberSequence([new NumberSequenceKeypoint(0, 1, 0), new NumberSequenceKeypoint(1, 0, 0)])
								}
							/>
						</frame>
					</frame>
					<frame Key="HuePicker" BackgroundTransparency={1} Size={new UDim2(1, -5, 0, 10)} LayoutOrder={1}>
						<SlideDrag
							DetectProps={{
								Size: new UDim2(1, 0, 1, 5),
							}}
							SlideDir="X"
							PercentApply={(percent) => {
								handlersApply({
									...handlers,
									hue: percent,
								});
							}}
						></SlideDrag>
						<imagelabel
							AnchorPoint={new Vector2(0, 0.5)}
							BackgroundTransparency={1}
							Image="rbxassetid://14010941769"
							Position={new UDim2(0, 0, 0.5, 0)}
							Size={new UDim2(1, 0, 0, 5)}
						/>
						<frame
							Key="Handle"
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
							Position={new UDim2(handlers.hue, 0, 0.5, 0)}
							Size={new UDim2(0, 8, 0, 8)}
						>
							<uicorner CornerRadius={new UDim(0.5, 0)} />
							<uistroke Color={theme.TextColor} Thickness={2} />
						</frame>
					</frame>
					{props.AlphaChanel !== undefined ? (
						<frame Key="AlphaPicker" BackgroundTransparency={1} Size={new UDim2(1, -5, 0, 10)} LayoutOrder={2}>
							<SlideDrag
								DetectProps={{
									Size: new UDim2(1, 0, 1, 5),
								}}
								SlideDir="X"
								PercentApply={(percent) => {
									setAlpha(1 - percent);
								}}
							></SlideDrag>
							<frame
								Key={"ColorFrame"}
								Size={new UDim2(1, 0, 0, 5)}
								Position={new UDim2(0, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0, 0.5)}
								BackgroundColor3={color}
								ZIndex={2}
							>
								<uigradient
									Transparency={
										new NumberSequence([
											new NumberSequenceKeypoint(0, 0, 0),
											new NumberSequenceKeypoint(1, 1, 0),
										])
									}
								/>
							</frame>
							<imagelabel
								Key="AlphaPattern"
								AnchorPoint={new Vector2(0, 0.5)}
								BackgroundTransparency={1}
								Image="rbxassetid://14013491588"
								Position={new UDim2(0, 0, 0.5, 0)}
								Size={new UDim2(1, 0, 0, 5)}
								ScaleType={Enum.ScaleType.Tile}
								TileSize={new UDim2(0, 5, 0, 5)}
							/>
							<frame
								Key="Handle"
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundTransparency={1}
								Position={new UDim2(1 - alpha, 0, 0.5, 0)}
								Size={new UDim2(0, 8, 0, 8)}
								ZIndex={3}
							>
								<uicorner CornerRadius={new UDim(0.5, 0)} />
								<uistroke Color={theme.TextColor} Thickness={2} />
							</frame>
						</frame>
					) : undefined}
					<Entry
						Key="HexEntry"
						Value={color}
						LayoutOrder={3}
						Text={"Hex"}
						Parser={Parsers.Hex}
						Decoder={Decoders.Hex}
						Applier={colorApply}
						Theme={theme}
					></Entry>
					<Entry
						Key="RBGEntry"
						Value={color}
						LayoutOrder={4}
						Text={"RBG"}
						Parser={Parsers.RGB}
						Decoder={Decoders.RBG}
						Applier={colorApply}
						Theme={theme}
					></Entry>
					{props.AlphaChanel ? (
						<Entry
							Key="AlphaEntry"
							Value={alpha}
							LayoutOrder={5}
							Text={"Alpha"}
							Parser={Parsers.Alpha}
							Decoder={Decoders.Alpha}
							Applier={(alpha) => setAlpha(alpha)}
							Theme={theme}
						></Entry>
					) : undefined}
				</Div>
				<Div
					Key="ColorBar"
					AnchorPoint={new Vector2(0, 1)}
					LayoutOrder={flipped ? -1 : 1}
					Position={new UDim2(0, -1, 1, 1)}
					Size={new UDim2(1, 2, 0, 8)}
				>
					<frame
						Key="Holder"
						BackgroundColor3={color}
						Position={new UDim2(0, 0, 0, flipped ? -1 : 1)}
						Size={UDim2.fromScale(1, 1)}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
						<frame
							Key="Squared"
							BackgroundColor3={color}
							BorderSizePixel={0}
							AnchorPoint={new Vector2(0, flipped ? 1 : 0)}
							Position={UDim2.fromScale(0, flipped ? 1 : 0)}
							Size={new UDim2(1, 0, 0.5, 0)}
						/>
						<imagelabel
							Key="Pointer"
							BackgroundTransparency={1}
							Image={flipped ? "rbxassetid://14015191273" : "rbxassetid://14010784349"}
							ImageColor3={color}
							AnchorPoint={new Vector2(0, flipped ? 1 : 0)}
							Position={new UDim2(0, 15, flipped ? 0 : 1, 0)}
							Size={new UDim2(0, 18, 0, 7)}
						/>
					</frame>
				</Div>
			</frame>
			<frame
				Key="Separator"
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundTransparency={1}
				LayoutOrder={flipped ? -1 : 1}
			></frame>
		</PositionBinder>
	);
}
const ColorPicker = withHooks(ColorPickerCreate);

export = ColorPicker;
