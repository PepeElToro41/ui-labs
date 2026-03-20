import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";
import { useToolbarHovered } from "Context/StoryPanelContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";

import { useButtonElements } from "../Utils";

interface RenderToolButtonsProps {
	PreviewEntry: PreviewEntry;
	HoverAlpha: React.Binding<UDim2> | UDim2;
	IsAnchored?: boolean;

	onContentHeightChanged?: (height: number) => void;
}

function RenderToolButtons(props: RenderToolButtonsProps) {
	const theme = useTheme();

	const buttonElements = useButtonElements(props.PreviewEntry);
	const [, setToolbarHovered] = useToolbarHovered();

	const [contentHeight, setContentHeight] = useState(0);

	useEffect(() => {
		if (props.onContentHeightChanged) {
			props.onContentHeightChanged(contentHeight);
		}
	}, [contentHeight]);

	useUnmountEffect(() => {
		setToolbarHovered(false);
	});

	return (
		<canvasgroup
			key={"ButtonsContainerCanvas"}
			Size={UDim2.fromScale(1, 1)}
			BackgroundTransparency={props.IsAnchored ? 1 : 0.2}
			BackgroundColor3={theme.Toolbar}
			Position={props.HoverAlpha}
			Event={{
				MouseEnter: () => setToolbarHovered(true),
				MouseLeave: () => setToolbarHovered(false)
			}}
		>
			{!props.IsAnchored && <Corner Radius={6} />}

			<scrollingframe
				key={"ButtonsContainer"}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				CanvasSize={new UDim2(1, 0, 0, contentHeight)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollBarThickness={0}
				ElasticBehavior={Enum.ElasticBehavior.Never}
			>
				<Padding Padding={2} />

				<TopList
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 2)}
					Change={{
						AbsoluteContentSize: (rbx) => setContentHeight(rbx.AbsoluteContentSize.Y + 4)
					}}
				/>

				{buttonElements}
			</scrollingframe>
		</canvasgroup>
	);
}

export default RenderToolButtons;
