import { useEventListener } from "@rbxts/pretty-roact-hooks";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import Signal from "Utils/Signal";

export = (
	mouseIconContext: IsMouseIconContext,
	inputConnections: InputSignals,
	toolStarted: boolean,
	onToolActivated: (active: boolean, startMouse?: Vector2) => void,
) => {
	const [toolActivated, setToolActivated] = useState(false);
	const [mousePos, setMousePos] = useState(new Vector2(0, 0));
	useEventListener(inputConnections.MouseMoved, (mousePos, inPlugin) => {
		if (!inPlugin) return;
		setMousePos(mousePos);
	});
	useEventListener(inputConnections.InputBegan, (input, _, inPlugin) => {
		if (!inPlugin) return;
		if (!toolStarted) return;
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setToolActivated(true);
		}
	});
	useEventListener(inputConnections.InputEnded, (input, _, inPlugin) => {
		if (!inPlugin) return;
		if (!toolStarted) return;
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setToolActivated(false);
		}
	});
	useEffect(() => {
		if (toolActivated) {
			onToolActivated(true, mousePos);
		} else {
			onToolActivated(false);
		}
	}, [toolActivated]);
	useEffect(() => {
		if (toolStarted) mouseIconContext.setMouseIcon("Measure", "Cross");
		else mouseIconContext.unsetMouseIcon("Measure");
	}, [toolStarted]);
	return;
};
