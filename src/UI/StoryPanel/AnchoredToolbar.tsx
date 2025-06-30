import React, { useCallback } from "@rbxts/react";

import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown";
import RenderToolButtons from "UI/StoryOverlay/IconToolbar/Buttons.tsx";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";

import { useProducer } from "@rbxts/react-reflex";
import { useCanvasHeight } from "Context/StoryPanelContext";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";

interface AnchoredToolbarProps {
	PreviewEntry: PreviewEntry;
}

function AnchoredToolbar(props: AnchoredToolbarProps) {
	const theme = useTheme();

	const { setPopup } = useProducer<RootProducer>();

	const [canvasHeight] = useCanvasHeight();
	const mouseOffset = useMouseOffset();

	const onToolbarLeftClick = useCallback(() => {
		const offset = mouseOffset.getValue();

		setPopup(
			"BackButtonDropdown",
			<ToolbarDropdown Position={offset} />,
			"ButtonDropdown"
		);
	}, []);

	return (
		<Div Size={new UDim2(0, 39, 1, 0)}>
			<uisizeconstraint MaxSize={new Vector2(math.huge, canvasHeight + 10)} />

			<Padding Padding={1} />
			<frame
				BackgroundColor3={theme.Toolbar}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
			>
				<Corner Radius={6} />

				<Detector
					Event={{
						MouseButton2Click: onToolbarLeftClick
					}}
				/>

				<RenderToolButtons
					PreviewEntry={props.PreviewEntry}
					HoverAlpha={UDim2.fromScale(0, 0)}
					IsAnchored
				/>
			</frame>
		</Div>
	);
}

export default AnchoredToolbar;
