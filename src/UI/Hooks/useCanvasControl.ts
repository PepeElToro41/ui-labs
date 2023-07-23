import { useEventListener } from "@rbxts/pretty-roact-hooks";
import { useEffect, useState } from "@rbxts/roact-hooked";
import { GlobalConnectionsType } from "UI/Contexts/GlobalConnections";
import Signal from "Utils/Signal";

declare global {
	interface InputSignals {
		InputBegan: Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>;
		InputEnded: Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>;
		InputChanged: Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>;
		MouseMoved: Signal<(mousePos: Vector2, inPlugin?: boolean) => void>;
	}
}

export const useCanvasControl = (iconContext: IsMouseIconContext, inputConnections: InputSignals) => {
	//Input states
	const [ctrlPressed, setCtrlPressed] = useState(false);
	const [shiftPressed, setShiftPressed] = useState(false);
	const [mouseHeld, setMouseHeld] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [posShift, setPosShift] = useState(new Vector2(0, 0));
	//q: how can I omit the second argument?

	useEventListener(inputConnections.InputBegan, (input, _, inPlugin) => {
		if (!inPlugin) return;
		if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlPressed(true);
		} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftPressed(true);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setMouseHeld(true);
		}
	});
	useEventListener(inputConnections.InputEnded, (input, _, inPlugin) => {
		if (!inPlugin) return;
		if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlPressed(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftPressed(false);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setMouseHeld(false);
		}
	});
	useEventListener(inputConnections.InputChanged, (input, _, inPlugin) => {
		if (!inPlugin) return;
		if (input.UserInputType === Enum.UserInputType.MouseWheel) {
			if (!shiftPressed) return;
			const newZoom = zoom + input.Position.Z * 0.05;
			setZoom(newZoom);
		}
	});
	useEffect(() => {
		if (!ctrlPressed || !mouseHeld) return;
		let lastPosition: Vector2;
		const onMouseMoved = inputConnections.MouseMoved.Connect((Position) => {
			if (!lastPosition) {
				lastPosition = Position;
				return;
			}
			const delta = Position.sub(lastPosition);
			setPosShift(posShift.add(delta));
		});
		return () => {
			onMouseMoved.Disconnect();
		};
	}, [ctrlPressed, mouseHeld]);
	//Icon Control
	useEffect(() => {
		if (ctrlPressed) iconContext.SetMouseIcon("CanvasMove", "Move");
		else iconContext.UnsetMouseIcon("CanvasMove");
	}, [ctrlPressed]);
	useEffect(() => {
		if (shiftPressed) iconContext.SetMouseIcon("CanvasResize", "ResizeAll");
		else iconContext.UnsetMouseIcon("CanvasResize");
	}, [shiftPressed]);
	return $tuple(zoom, posShift, setZoom, setPosShift);
};
