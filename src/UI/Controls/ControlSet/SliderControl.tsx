import { Instant, Spring, useEventListener, useMotor, useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useCallback, useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useTween } from "UI/Hooks/Utils/useTween";
import SlideDrag from "UI/UIUtils/Draggers/SlideDrag";
import { Div } from "UI/UIUtils/Styles/Div";

interface SliderControlProps extends Control.ControlType<number> {
	Max: number;
	Min: number;
	Step?: number;
}

const handleSizeInfo = new TweenInfo(0.1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

//Min size where marks will be rendered
const MINSIZE_MARK = 0.05;

function setProps(props: SliderControlProps) {
	return props;
}

function Mark(props: { Amount: number; Position: number; Percent: Roact.Binding<number>; Theme: Theme }) {
	const theme = props.Theme;
	const size = (1 / props.Amount) * props.Position;
	return (
		<frame
			Key={"Mark" + props.Position}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={props.Percent.map((percent) => {
				return percent >= size ? Color3.fromRGB(0, 175, 255) : theme.ControlTheme.Slider.NonFillColor;
			})}
			BorderSizePixel={0}
			Position={new UDim2(size, 0, 0.5, 0)}
			Size={new UDim2(0, 7, 0, 7)}
		>
			<uicorner />
		</frame>
	);
}

function GetPercent(props: SliderControlProps, amount: number) {
	const { Min, Max } = props;
	const gap = Max - Min;
	return (amount - Min) / gap;
}

function SliderControlCreate(setprops: SliderControlProps) {
	const props = identity<Required<SliderControlProps>>(setProps(setprops) as Required<SliderControlProps>);
	const theme = useContext(ThemeContext).Theme;
	const [amount, _setAmount] = useState(props.Control.Bind.Current as number);
	const [percSize, setPercSize] = useMotor(GetPercent(props, amount));
	const [handleSize, tweenHandleSize] = useTween(handleSizeInfo, 12);
	//---HANDLING SLIDE---
	const markVisible = useMemo(() => {
		if (!props.Step) return false;
		const markDelta = props.Max - props.Min;
		const markSize = props.Step / markDelta;
		return markSize >= MINSIZE_MARK;
	}, [props.Max, props.Min, props.Step]);
	//---HANDLING AMOUNT---

	const resetControls = () => {
		_setAmount(props.Default);
	};
	useUpdateEffect(() => {
		resetControls();
	}, [props.Default]);
	useEventListener(props.ResetListen, () => {
		resetControls();
	});
	useEffect(() => {
		const percent = GetPercent(props, amount);
		if (markVisible) {
			setPercSize(new Spring(percent));
		} else {
			setPercSize(new Instant(percent));
		}
		props.ControlApply(amount);
	}, [amount]);
	const SetAmount = useCallback((value: number) => {
		value = math.clamp(value, props.Min, props.Max);
		if (!props.Step) {
			_setAmount(value);
			return;
		}
		const delta = value - props.Min;
		const steppedDelta = math.round(delta / props.Step) * props.Step;
		_setAmount(props.Min + steppedDelta);
	}, []);
	//---CREATING MARKS---
	const marks = useMemo(() => {
		const allMarks: Roact.Element[] = [];
		//First and Last mark (always there)
		allMarks.push(<Mark Amount={1} Position={0} Percent={percSize} Theme={theme}></Mark>);
		allMarks.push(<Mark Amount={1} Position={1} Percent={percSize} Theme={theme}></Mark>);
		if (!props.Step) return allMarks;

		const markDelta = props.Max - props.Min;
		const markSize = props.Step / markDelta;
		if (!markVisible) return allMarks;

		const markAmount = math.floor(1 / markSize);
		for (let i = 0; i < markAmount - 1; i++) {
			const newMark = <Mark Amount={markAmount} Position={i + 1} Percent={percSize} Theme={theme} />;
			allMarks.push(newMark);
		}
		return allMarks;
	}, [props.Min, props.Max, props.Step, theme]);

	return (
		<>
			<frame Key="Entry" BackgroundColor3={theme.SearchInput} BorderSizePixel={0} Size={new UDim2(0, 65, 0, 22)}>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<textbox
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					PlaceholderColor3={theme.SearchPlaceholder}
					PlaceholderText={tostring(math.floor(amount * 100) / 100)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					Text={""}
					TextColor3={theme.TextColor}
					TextSize={12}
					Event={{
						FocusLost: (input) => {
							const number = tonumber(input.Text);
							if (number) {
								SetAmount(number);
							}
							input.Text = "";
						},
					}}
				/>
			</frame>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 5)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<Div Key="SlideFrame" Size={new UDim2(1, -80, 1, 0)}>
				<Div
					Key="SlideDiv"
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					LayoutOrder={1}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Size={new UDim2(1, -100, 1, 0)}
				>
					<frame
						Key="Slide"
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={theme.ControlTheme.Slider.NonFillColor}
						BorderSizePixel={0}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(1, -30, 0, 3)}
					>
						<SlideDrag
							Key="SlideDetector"
							DetectProps={{
								AnchorPoint: new Vector2(0.5, 0.5),
								BackgroundTransparency: 1,
								Position: UDim2.fromScale(0.5, 0.5),
								Size: new UDim2(1, 0, 0, 15),
								ZIndex: 3,
							}}
							SlideDir="X"
							PercentApply={(percent) => {
								SetAmount(percent * (props.Max - props.Min) + props.Min);
							}}
							StateUpdated={(state) => {
								const { hovering, dragging } = state;
								tweenHandleSize(dragging ? 17 : hovering ? 14 : 12);
							}}
						></SlideDrag>
						<uicorner />
						<frame
							Key="Percentage"
							BackgroundColor3={Color3.fromRGB(0, 175, 255)}
							BorderSizePixel={0}
							Size={percSize.map((size) => new UDim2(size, 0, 1, 0))}
							ZIndex={2}
						>
							<frame
								Key="Handle"
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundColor3={Color3.fromRGB(0, 175, 255)}
								BorderSizePixel={0}
								Position={new UDim2(1, 0, 0.5, 0)}
								Size={handleSize.map((size) => new UDim2(0, size, 0, size))}
							>
								<uicorner CornerRadius={new UDim(0.5, 0)} />
							</frame>
						</frame>
						<Div Key="Marks">{marks}</Div>
					</frame>
				</Div>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					Padding={new UDim(0, 5)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<textlabel
					Key="Min"
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					Size={new UDim2(0, 45, 1, 0)}
					Text={tostring(props.Min)}
					TextColor3={theme.TextColor}
					TextSize={12}
					TextXAlignment={Enum.TextXAlignment.Right}
				/>
				<textlabel
					Key="Max"
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					LayoutOrder={2}
					Size={new UDim2(0, 45, 1, 0)}
					Text={tostring(props.Max)}
					TextColor3={theme.TextColor}
					TextSize={12}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Div>
		</>
	);
}
const SliderControl = withHooks(SliderControlCreate);

export = SliderControl;
