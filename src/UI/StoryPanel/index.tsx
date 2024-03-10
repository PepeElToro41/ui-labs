import React, { useBinding, useState } from "@rbxts/react";
import FrameFill from "UI/Holders/FrameFill";
import ActionsPanel from "UI/StoryOverlay/ActionsPanel";
import BackgroundPattern from "./BackgroundPattern";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import StoryTitle from "./StoryTitle";
import { Div } from "UI/Styles/Div";
import List from "UI/Styles/List";
import StoryPanel from "UI/StoryPanel";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { selectPreview } from "Reflex/StoryPreview/StoryMount";
import { selectStorySelected } from "Reflex/StorySelection";
import PreviewControl from "UI/StoryPreview/PreviewControl";
import StoryOverlay from "UI/StoryOverlay";
import { StoryPanelProvider } from "Context/StoryPanelContext";

interface StoryContentsProps {}

function setProps(props: StoryContentsProps) {
	return props as Required<StoryContentsProps>;
}

function StoryContents(props: StoryContentsProps) {
	const theme = useTheme();
	const selectedEntry = useSelector(selectStorySelected);
	const entry = useSelectorCreator(selectPreview, selectedEntry);

	return (
		<FrameFill key="StoryContents" FrameProps={{ BackgroundTransparency: 0, BackgroundColor3: theme.StoryPanel.Color, LayoutOrder: 1 }}>
			<BackgroundPattern />
			<Div key="StoryFrame">
				<List />
				<StoryTitle />
				<Div key={"StoryPanel"} Size={new UDim2(1, 0, 1, -31)}>
					<StoryPanelProvider>
						<PreviewControl />
						<StoryOverlay key={"StoryOverlay"} PreviewEntry={entry} />
					</StoryPanelProvider>
				</Div>
			</Div>
		</FrameFill>
	);
}

export default StoryContents;
