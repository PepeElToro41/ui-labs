import Immut from "@rbxts/immut";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { useInputBegan, useInputEnded } from "Hooks/Context/UserInput";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";

interface CanvasControlsProps {
	PreviewEntry: PreviewEntry;
}

function CanvasControls(props: CanvasControlsProps) {
	const [mousePos, setMousePos] = useBinding<Vector2>(new Vector2());
	const [inside, insideApi] = useToggler(false);
	const [middleClicked, setMiddleClicked] = useState(false);
	const [mouseDragging, setMouseDragging] = useState(false);
	const [shiftClicked, setShiftClicked] = useState(false);

	const inputEnded = useInputEnded();
	const inputBegan = useInputBegan();
	const { updateMountData } = useProducer<RootProducer>();

	const OnInputChanged = useCallback(
		(_: Frame, input: InputObject) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				setMousePos(new Vector2(input.Position.X, input.Position.Y));
			} else if (input.UserInputType === Enum.UserInputType.MouseWheel) {
				if (!shiftClicked) return;
				updateMountData(props.PreviewEntry.Key, (old) =>
					Immut.produce(old, (draft) => {
						draft.Zoom += input.Position.Z * 5;
					}),
				);
			}
		},
		[shiftClicked],
	);
	const OnInputBegan = useCallback((_: Frame, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(true);
		}
	}, []);
	useEventListener(inputEnded, (input) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(false);
		}
	});
	useEventListener(inputBegan, (input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(true);
		}
	});

	useEffect(() => {
		if (!inside) setMiddleClicked(false);
		if (!inside || !middleClicked) return setMouseDragging(false);
		setMouseDragging(true);
	}, [middleClicked]);
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
				}),
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
				MouseLeave: insideApi.disable,
			}}
		></Div>
	);
}

export default CanvasControls;
