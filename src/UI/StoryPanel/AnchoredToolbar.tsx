import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown";
import RenderToolButtons from "UI/StoryOverlay/IconToolbar/Buttons.tsx";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";

interface AnchoredToolbarProps {
	PreviewEntry: PreviewEntry;
}

function AnchoredToolbar(props: AnchoredToolbarProps) {
	const theme = useTheme();
	const { setPopup } = useProducer<RootProducer>();
	const mouseOffset = useMouseOffset();

	const OnToolbarLeftClick = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup("BackButtonDropdown", <ToolbarDropdown Position={offset} />, "ButtonDropdown");
	}, []);

	return (
		<Div Size={new UDim2(0, 39, 1, 0)}>
			<Padding Padding={1} />
			<Div Size={UDim2.fromScale(1, 1)}>
				<uistroke Color={theme.Divisor.Color} Thickness={1} Transparency={theme.Divisor.Transparency} />
				<Corner Radius={6} />
				<Detector
					Event={{
						MouseButton2Click: OnToolbarLeftClick,
					}}
				/>
				<RenderToolButtons PreviewEntry={props.PreviewEntry} HoverAlpha={UDim2.fromScale(0, 0)} />
			</Div>
		</Div>
	);
}

export default AnchoredToolbar;
