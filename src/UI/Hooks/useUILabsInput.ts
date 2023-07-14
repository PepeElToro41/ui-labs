import { useEventListener } from "@rbxts/pretty-roact-hooks";
import { useMemo } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";
import Signal from "Utils/Signal";

export = (uisEnabled: boolean, mouseChangedEvent: Signal<(mousePos: Vector2) => void>) => {
	const canvasInputs = useMemo(() => {
		return {
			InputBegan: new Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>(),
			InputEnded: new Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>(),
			InputChanged: new Signal<(input: InputObject, gameProcessed: boolean, inPlugin?: boolean) => void>(),
			MouseMoved: new Signal<(mousePos: Vector2, inPlugin?: boolean) => void>(),
		};
	}, []);
	useEventListener(mouseChangedEvent, (mousePos) => {
		canvasInputs.MouseMoved.Fire(mousePos, true);
	});
	useEventListener(UserInputService.InputBegan, (input, gameProcessed) => {
		if (uisEnabled) {
			canvasInputs.InputBegan.Fire(input, gameProcessed);
		}
	});
	useEventListener(UserInputService.InputEnded, (input, gameProcessed) => {
		if (uisEnabled) {
			canvasInputs.InputEnded.Fire(input, gameProcessed);
		}
	});
	useEventListener(UserInputService.InputChanged, (input, gameProcessed) => {
		if (input.UserInputType === Enum.UserInputType.MouseMovement) {
			canvasInputs.MouseMoved.Fire(new Vector2(input.Position.X, input.Position.Y));
		}
		if (uisEnabled) {
			canvasInputs.InputChanged.Fire(input, gameProcessed, false);
		}
	});
	return canvasInputs;
};
