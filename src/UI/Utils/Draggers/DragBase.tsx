import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useBinding, useCallback, useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useMutable } from "Hooks/Utils/Mutable";

export type SlideReturn = {
	X: number;
	Y: number;
	XY: Vector2;
};
export interface DragBaseProps {
	DetectProps: Roact.JsxInstanceProperties<TextButton>;
	MapCallback: (started: Vector2, current: Vector2, last: Vector2, slidePos: Vector2[]) => void;
	StateUpdated?: (state: { hovering: boolean; dragging: boolean }) => void;
}

function DragBase(props: DragBaseProps) {
	const slideRef = useRef<TextButton>();
	const [isDragging, setIsDragging] = useState(false);
	const [hovering, setHover] = useState(false);
	const mapCallback = useMutable(props.MapCallback);
	const [slideInput, setSlideInput] = useState<InputObject | undefined>(undefined);
	const [slideRect, setSlideRect] = useBinding<[Vector2, Vector2]>([new Vector2(), new Vector2()]);

	useEffect(() => {
		mapCallback.current = props.MapCallback;
	}, [props.MapCallback]);
	//---Setting Total Size---
	const setRect = useCallback((slideFrame: TextButton) => {
		const absSize = slideFrame.AbsoluteSize;
		const absPos = slideFrame.AbsolutePosition;
		setSlideRect([absPos, absPos.add(absSize)]);
	}, []);
	useEffect(() => {
		const slideFrame = slideRef.current;
		if (!slideFrame) return;
		setRect(slideFrame);
	}, []);
	//-------------------------
	//---Handling Dragging---
	useEffect(() => {
		if (!isDragging || !slideInput) return;

		const mouseStart = new Vector2(slideInput.Position.X, slideInput.Position.Y);
		let oldPos = mouseStart;
		const runListener = RunService.Heartbeat.Connect(() => {
			const mousePos = new Vector2(slideInput.Position.X, slideInput.Position.Y);
			const [minPos, maxPos] = slideRect.getValue();
			const rectSize = maxPos.sub(minPos);
			mapCallback.current(mouseStart, mousePos, oldPos, [minPos, rectSize]);
			oldPos = mousePos;
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

export default DragBase;
