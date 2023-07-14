import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useBinding, useCallback, useEffect, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { RunService } from "@rbxts/services";

type SlideReturn = {
	X: number;
	Y: number;
	XY: Vector2;
};

interface SlideDragProps<T extends keyof SlideReturn> {
	DetectProps: Roact.JsxInstanceProperties<TextButton>;
	SlideDir: T;
	NoClamp?: boolean;
	PercentApply: (percent: SlideReturn[T]) => void;
	StateUpdated?: (state: { hovering: boolean; dragging: boolean }) => void;
}

function SlideDragCreate<T extends keyof SlideReturn>(props: SlideDragProps<T>) {
	const slideRef = useRef<TextButton>();
	const [isDragging, setIsDragging] = useState(false);
	const [hovering, setHover] = useState(false);
	const [slideInput, setSlideInput] = useState<InputObject | undefined>(undefined);
	const [slideRect, setSlideRect] = useBinding<[Vector2, Vector2]>([new Vector2(), new Vector2()]);
	//---Setting Total Size---
	const setRect = useCallback((slideFrame: TextButton) => {
		const absSize = slideFrame.AbsoluteSize;
		const absPos = slideFrame.AbsolutePosition;
		setSlideRect([absPos, absPos.add(absSize)]);
	}, []);
	useEffect(() => {
		const slideFrame = slideRef.getValue();
		if (!slideFrame) return;
		setRect(slideFrame);
	}, []);
	//-------------------------
	//---Handling Dragging---
	useEffect(() => {
		if (!isDragging) return;
		if (!slideInput) return;
		const runListener = RunService.Heartbeat.Connect(() => {
			const mousePos = new Vector2(slideInput.Position.X, slideInput.Position.Y);
			const [minPos, maxPos] = slideRect.getValue();
			let percent = mousePos.sub(minPos).div(maxPos.sub(minPos));
			if (!props.NoClamp) {
				percent = new Vector2(math.clamp(percent.X, 0, 1), math.clamp(percent.Y, 0, 1));
			}
			if (props.SlideDir === "X") {
				const apply = props.PercentApply as (percent: number) => void;
				apply(percent.X);
			} else if (props.SlideDir === "Y") {
				const apply = props.PercentApply as (percent: number) => void;
				apply(percent.Y);
			} else if (props.SlideDir === "XY") {
				const apply = props.PercentApply as (percent: Vector2) => void;
				apply(percent);
			}
		});
		return () => {
			runListener.Disconnect();
		};
	}, [isDragging]);
	//Updating state
	useUpdateEffect(() => {
		if (!props.StateUpdated) return;
		props.StateUpdated({ hovering: hovering, dragging: isDragging });
	}, [hovering, isDragging]);
	//-------------------------
	return (
		<textbutton
			Text={""}
			TextTransparency={1}
			AutoButtonColor={false}
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Change={{
				AbsoluteSize: (frame) => setRect(frame),
				AbsolutePosition: (frame) => setRect(frame),
			}}
			Event={{
				MouseEnter: () => {
					setHover(true);
				},
				MouseLeave: () => {
					setHover(false);
					if (!isDragging) setIsDragging(false);
				},
				InputBegan: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						setIsDragging(true);
					}
					if (input.UserInputType === Enum.UserInputType.MouseMovement) {
						setSlideInput(input);
					}
				},
				InputEnded: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						setIsDragging(false);
						//setSlideInput(undefined);
					}
				},
			}}
			Ref={slideRef}
			{...props.DetectProps}
		></textbutton>
	);
}
const SlideDrag = withHooks(SlideDragCreate);

export = SlideDrag;
