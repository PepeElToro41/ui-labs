import {
	Instant,
	Spring,
	useMotor,
	useUpdateEffect
} from "@rbxts/pretty-react-hooks";
import React, {
	useBinding,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import FrameFill from "UI/Holders/FrameFill";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";
import SlideDrag from "UI/Utils/Draggers/SlideDrag";
import InputEntry from "UI/Utils/InputEntry";
import { Decoders } from "UI/Utils/InputEntry/Decoders";
import { Filters } from "UI/Utils/InputEntry/Filters";
import { Parsers } from "UI/Utils/InputEntry/Parsers";
import Mark from "./Mark";

const MIN_MARK_SEPARATION = 15;

function CalculateMarks(control: AdvancedTypes.Slider) {
	if (control.Step === undefined) return 0;
	const markDelta = control.Max - control.Min;
	const markSize = control.Step / markDelta;

	return math.floor(1 / markSize);
}
function GetPercent(control: AdvancedTypes.Slider, current: number) {
	const gap = control.Max - control.Min;
	return (current - control.Min) / gap;
}

const ACTIVE_INFO = new TweenInfo(
	0.08,
	Enum.EasingStyle.Linear,
	Enum.EasingDirection.Out
);

function SliderControl(props: ControlElementProps<AdvancedTypes.Slider>) {
	const theme = useTheme();
	const control = props.Control;
	const [inputSize, setInputSize] = useBinding(0);

	const [percent, setPercent] = useMotor(GetPercent(control, props.Current));
	const [amount, setAmount] = useState(props.Current);
	const [markVisible, setMarkVisible] = useState(false);
	const [sliderState, setSliderState] = useState({
		Hovering: false,
		Dragging: false
	});
	const [handleSize, tweenHandleSize] = useTween(ACTIVE_INFO, 0);
	const sliderRef = useRef<Frame>();

	const active = sliderState.Dragging || sliderState.Hovering;

	const marks = useMemo(() => {
		const allMarks: React.Element[] = [];

		//First and Last mark (always there)
		allMarks.push(<Mark Amount={1} Position={0} Percent={percent}></Mark>);
		allMarks.push(<Mark Amount={1} Position={1} Percent={percent}></Mark>);

		if (control.Step === undefined) return allMarks;
		if (!markVisible) return allMarks;

		const markAmount = CalculateMarks(control);
		for (let i = 0; i < markAmount - 1; i++) {
			const newMark = (
				<Mark Amount={markAmount} Position={i + 1} Percent={percent} />
			);
			allMarks.push(newMark);
		}
		return allMarks;
	}, [control.Min, control.Max, control.Step, markVisible, theme]);

	useEffect(() => {
		const connection = RunService.PreRender.Connect(() => {
			const slider = sliderRef.current;
			if (!slider) return setMarkVisible(false);
			if (control.Step === undefined) return setMarkVisible(false);

			const slideSize = slider.AbsoluteSize.X;
			const separationSize = math.floor(slideSize / CalculateMarks(control));
			if (separationSize > MIN_MARK_SEPARATION) {
				if (!markVisible) setMarkVisible(true);
			} else {
				if (markVisible) setMarkVisible(false);
			}
		});

		return () => connection.Disconnect();
	}, [control.Min, control.Max, control.Step, markVisible]);

	useUpdateEffect(() => {
		if (amount === props.Current) return;
		setAmount(props.Current);
	}, [props.Current]);

	useUpdateEffect(() => {
		const percent = GetPercent(control, props.Current);
		if (markVisible) {
			setPercent(new Spring(percent));
		} else {
			setPercent(new Instant(percent));
		}
	}, [props.Current]);
	useUpdateEffect(() => {
		tweenHandleSize(active ? 1 : 0);
	}, [active]);

	const ApplyAmount = useCallback(
		(amount: number) => {
			amount = math.clamp(amount, control.Min, control.Max);
			if (control.Step === undefined) {
				setAmount(amount);
				return props.Apply(amount);
			}

			const delta = amount - control.Min;
			const steppedDelta = math.round(delta / control.Step!) * control.Step!;
			const finalAmount = control.Min + steppedDelta;
			if (amount !== finalAmount) {
				setAmount(finalAmount);
				props.Apply(finalAmount);
			}
		},
		[control.Min, control.Max, control.Step, props.Apply, amount]
	);
	const SetPercent = useCallback(
		(percent: number) => {
			const amount = percent * (control.Max - control.Min) + control.Min;
			ApplyAmount(amount);
		},
		[ApplyAmount]
	);
	const OnStateUpdated = useCallback(
		(state: { hovering: boolean; dragging: boolean }) => {
			setSliderState({ Hovering: state.hovering, Dragging: state.dragging });
		},
		[]
	);
	const OnInputAbsoluteSizeChanged = useCallback(
		(entry: Frame) => {
			if (sliderState.Dragging) return;
			setInputSize(entry.AbsoluteSize.X);
		},
		[sliderState.Dragging]
	);

	return (
		<Div>
			<Padding PaddingY={4} />
			<LeftList
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 7)}
			/>
			<Div
				AutomaticSize={sliderState.Dragging ? undefined : Enum.AutomaticSize.X}
				Size={
					sliderState.Dragging
						? inputSize.map((offset) => new UDim2(0, offset, 1, 0))
						: UDim2.fromScale(0, 1)
				}
				Change={{
					AbsoluteSize: OnInputAbsoluteSizeChanged
				}}
			>
				<InputEntry
					Value={props.Current}
					Apply={ApplyAmount}
					Parser={Parsers.NumberParser(3)}
					Decoder={Decoders.NumberDecoder()}
					Filters={[Filters.NumberOnly]}
					TextboxProps={{
						TextSize: 12,
						Size: sliderState.Dragging
							? UDim2.fromScale(1, 1)
							: UDim2.fromScale(0, 1),
						AutomaticSize: sliderState.Dragging
							? undefined
							: Enum.AutomaticSize.X,
						TextXAlignment: Enum.TextXAlignment.Center
					}}
					HolderProps={{
						LayoutOrder: 1,
						Size: sliderState.Dragging
							? UDim2.fromScale(1, 1)
							: UDim2.fromScale(0, 1),
						AutomaticSize: sliderState.Dragging
							? undefined
							: Enum.AutomaticSize.X
					}}
				>
					<uisizeconstraint
						MaxSize={new Vector2(120, math.huge)}
						MinSize={new Vector2(35, 0)}
					/>
				</InputEntry>
			</Div>
			<FrameFill FillDir="X" FrameProps={{ LayoutOrder: 2 }}>
				<Padding PaddingX={5} />
				<Text
					Size={new UDim2(0, 30, 1, 0)}
					Text={tostring(control.Min)}
					TextSize={12}
					AnchorPoint={new Vector2(0, 0.5)}
					TextXAlignment={Enum.TextXAlignment.Right}
					Position={UDim2.fromScale(0, 0.5)}
				/>
				<Div
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={new UDim2(1, -75, 1, 0)}
				>
					<frame
						key="Slide"
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={theme.Search.Color}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(1, -30, 0, 3)}
						ref={sliderRef}
					>
						<Corner Radius={8} />
						<SlideDrag
							key="SlideDetector"
							DetectProps={{
								AnchorPoint: new Vector2(0.5, 0.5),
								BackgroundTransparency: 1,
								Position: UDim2.fromScale(0.5, 0.5),
								Size: new UDim2(1, 0, 0, 15),
								ZIndex: 3
							}}
							SlideDir="X"
							PercentApply={SetPercent}
							StateUpdated={OnStateUpdated}
						></SlideDrag>
						<frame
							key="Percentage"
							BackgroundColor3={theme.StorySelected.Color}
							BorderSizePixel={0}
							Size={percent.map((p) => UDim2.fromScale(p, 1))}
							ZIndex={2}
						>
							<frame
								key="Handle"
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundColor3={theme.StorySelected.Color}
								BorderSizePixel={0}
								Position={new UDim2(1, 0, 0.5, 0)}
								Size={handleSize.map((a) =>
									UDim2.fromOffset(10 + a * 3, 10 + a * 3)
								)}
							>
								<Rounder />
							</frame>
						</frame>
						<Div key={"Marks"}>{marks}</Div>
					</frame>
				</Div>
				<Text
					Size={new UDim2(0, 30, 1, 0)}
					Text={tostring(control.Max)}
					TextSize={12}
					TextXAlignment={Enum.TextXAlignment.Left}
					AnchorPoint={new Vector2(1, 0.5)}
					Position={UDim2.fromScale(1, 0.5)}
				/>
			</FrameFill>
		</Div>
	);
}

export default SliderControl;
