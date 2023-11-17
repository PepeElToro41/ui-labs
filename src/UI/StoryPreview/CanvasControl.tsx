import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";
import { RunService } from "@rbxts/services";
import { Div } from "UI/Styles/Div";

interface CanvasControlProps {}

function setProps(props: CanvasControlProps) {
	return props as Required<CanvasControlProps>;
}

function CanvasControlCreate(setprops: CanvasControlProps) {
	const props = setProps(setprops as Required<CanvasControlProps>);
	const [mouseInput, setMouseInput] = useState<InputObject>();
	const [dragging, setDragging] = useState(false);
	const [shiftHeld, setShiftHeld] = useState(false);

	const { addOffset, addZoom } = useProducer<RootProducer>();

	useEffect(() => {
		if (!dragging) return;
		if (!mouseInput) return;
		const mouseStart = new Vector2(mouseInput.Position.X, mouseInput.Position.Y);
		let lastPos = mouseStart;
		const runListener = RunService.Heartbeat.Connect(() => {
			const mousePos = new Vector2(mouseInput.Position.X, mouseInput.Position.Y);
			const delta = mousePos.sub(lastPos);
			addOffset(delta);
			lastPos = mousePos;
		});

		return () => runListener.Disconnect();
	}, [dragging]);

	return (
		<Div
			Key="CanvasControl"
			Event={{
				InputBegan: (_, input: InputObject) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton3) {
						setDragging(true);
					} else if (input.UserInputType === Enum.UserInputType.MouseMovement) {
						setMouseInput(input);
					} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
						setShiftHeld(true);
					}
				},
				InputEnded: (_, input: InputObject) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton3) {
						setDragging(false);
					} else if (input.UserInputType === Enum.UserInputType.MouseMovement) {
						setMouseInput(undefined);
					} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
						setShiftHeld(false);
					}
				},
				InputChanged: (_, input: InputObject) => {
					if (input.UserInputType === Enum.UserInputType.MouseWheel) {
						if (!shiftHeld) return;
						addZoom(input.Position.Z * 0.05);
					}
				},
			}}
		></Div>
	);
}
const CanvasControl = withHooks(CanvasControlCreate);

export = CanvasControl;
