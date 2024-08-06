import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown";
import RenderToolButtons from "UI/StoryOverlay/IconToolbar/Buttons.tsx";
import { useButtonElements } from "UI/StoryOverlay/IconToolbar/Utils";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";

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
		<Div Size={new UDim2(0, 39, 1, 0)}>
			<Padding Padding={2} />
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0.2}
				BackgroundColor3={Color3.fromRGB(26, 26, 33)}
				BorderSizePixel={0}
			>
				<uistroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1} Transparency={0.95} />
				<Corner Radius={6} />
				<Detector
					Event={{
						MouseButton2Click: OnToolbarLeftClick,
					}}
				/>
				<RenderToolButtons PreviewEntry={props.PreviewEntry} HoverAlpha={UDim2.fromScale(0, 0)} />
			</frame>
		</Div>
	);
}

export default AnchoredToolbar;
