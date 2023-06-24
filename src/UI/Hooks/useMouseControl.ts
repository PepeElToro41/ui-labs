import { useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";

export const useMouseControl = (frameRef: Roact.Ref<Frame>) => {
	const [mousePos, setMousePos] = useState<Vector2>(new Vector2(0, 0));
	const [listenType, setListenType] = useState<"Plugin" | "Screen">("Screen");
	//Getters
	const GetMousePos = useCallback(() => {
		return mousePos;
	}, []);
	//Detecting UI Ancestry Changing
	useEffect(() => {
		const frame = frameRef.getValue();
		if (!frame) return;
		const updateAncestry = () => {
			const dockWidget = frame.FindFirstAncestorWhichIsA("DockWidgetPluginGui");
		};
		const frameAncestryChanged = frame.AncestryChanged.Connect(() => {
			updateAncestry();
		});
		updateAncestry();
		return () => {
			frameAncestryChanged.Disconnect();
		};
	}, [frameRef]);
	//Listening for mouse events
	useEffect(() => {}, [listenType]);
	return $tuple(mousePos, GetMousePos, setMousePos);
};
