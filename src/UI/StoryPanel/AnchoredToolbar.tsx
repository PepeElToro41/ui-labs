import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown";
import RenderToolButtons from "UI/StoryOverlay/IconToolbar/Buttons.tsx";
import { useButtonElements } from "UI/StoryOverlay/IconToolbar/Utils";
import { Detector } from "UI/Styles/Detector";

interface AnchoredToolbarProps {
	PreviewEntry: PreviewEntry;
}

function AnchoredToolbar(props: AnchoredToolbarProps) {
	const buttonElements = useButtonElements(props.PreviewEntry);
	const { setOverlay } = useProducer<RootProducer>();
	const mouseOffset = useMouseOffset();

	const OnToolbarLeftClick = useCallback(() => {
		const offset = mouseOffset.getValue();
		setOverlay("BackButtonDropdown", <ToolbarDropdown Position={offset} />, "ButtonDropdown");
	}, []);

	return (
		<frame Size={new UDim2(0, 37, 1, 0)} BackgroundTransparency={0.2} BackgroundColor3={Color3.fromRGB(26, 26, 33)} BorderSizePixel={0}>
			<Detector
				Event={{
					MouseButton2Click: OnToolbarLeftClick,
				}}
			/>
			<RenderToolButtons PreviewEntry={props.PreviewEntry} HoverAlpha={UDim2.fromScale(0, 0)} />
		</frame>
	);
}

export default AnchoredToolbar;
