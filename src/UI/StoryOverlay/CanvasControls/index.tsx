import Immut from "@rbxts/immut";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { useInputBegan, useInputEnded, useMousePos } from "Hooks/Context/UserInput";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";

interface CanvasControlsProps {
	PreviewEntry: PreviewEntry;
}

function CanvasControls(props: CanvasControlsProps) {
	const mousePos = useMousePos();
	const [inside, insideApi] = useToggler(false);
	const [middleClicked, setMiddleClicked] = useState(false);
	const [leftClicked, setLeftClicked] = useState(false);
	const [mouseDragging, setMouseDragging] = useState(false);
	const [shiftClicked, setShiftClicked] = useState(false);
	const [ctrlClicked, setCtrlClicked] = useState(false);

	const inputEnded = useInputEnded();
	const inputBegan = useInputBegan();
	const { updateMountData, addZoom } = useProducer<RootProducer>();

	const OnInputChanged = useCallback(
		(_: Frame, input: InputObject) => {
			if (input.UserInputType === Enum.UserInputType.MouseWheel) {
				if (ctrlClicked || shiftClicked) {
					let cursorRelativeToAnchor: Vector2 | undefined;
					// Ctrl-Zoom zooms towards the cursor
					// Shift-Zoom simply zooms
					if (ctrlClicked) {
						const holder = props.PreviewEntry.Holder;
						if (holder) {
							const holderAnchorPos = holder.AbsolutePosition.add(holder.AbsoluteSize.mul(holder.AnchorPoint));
							const currentPos = mousePos.getValue();
							cursorRelativeToAnchor = currentPos.sub(holderAnchorPos);
						}
					}
					addZoom(props.PreviewEntry.Key, input.Position.Z * 20, cursorRelativeToAnchor);
				}
			}
		},
		[ctrlClicked, shiftClicked]
	);
	const OnInputBegan = useCallback((_: Frame, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(true);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setLeftClicked(true);
		}
	}, []);
	useEventListener(inputEnded, (input) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(false);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setLeftClicked(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlClicked(false);
		}
	});
	useEventListener(inputBegan, (input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(true);
		} else if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlClicked(true);
		}
	});

	useEffect(() => {
		if (!inside) setMiddleClicked(false);
		const ctrlDrag = ctrlClicked && leftClicked;
		if (!inside || !(middleClicked || ctrlDrag)) {
			return setMouseDragging(false);
		}
		setMouseDragging(true);
	}, [middleClicked, ctrlClicked, leftClicked]);
	useEffect(() => {
		if (!mouseDragging) return;

		let previousPos = mousePos.getValue();
		const connection = RunService.PreRender.Connect(() => {
			const currentPos = mousePos.getValue();
			const delta = currentPos.sub(previousPos);
			previousPos = currentPos;

			updateMountData(props.PreviewEntry.Key, (old) =>
				Immut.produce(old, (draft) => {
					draft.Offset = old.Offset.add(delta);
				})
			);
		});

		return () => connection.Disconnect();
	}, [mouseDragging, props.PreviewEntry]);

	return (
		<Div
			Event={{
				InputBegan: OnInputBegan,
				InputChanged: OnInputChanged,
				MouseEnter: insideApi.enable,
				MouseLeave: insideApi.disable
			}}
		></Div>
	);
}

export default CanvasControls;
