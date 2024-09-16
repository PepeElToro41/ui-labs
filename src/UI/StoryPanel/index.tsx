import React from "@rbxts/react";
import BackgroundPattern from "./BackgroundPattern";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import StoryTitle from "./StoryTitle";
import { Div } from "UI/Styles/Div";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { selectPreview } from "Reflex/StoryPreview";
import { selectStorySelected } from "Reflex/StorySelection";
import { StoryPanelProvider } from "Context/StoryPanelContext";
import PanelRender from "./PanelRender";
import TopList from "UI/Styles/List/TopList";
import { selectIsLightBackground } from "Reflex/Theme";

interface StoryContentsProps {}

function setProps(props: StoryContentsProps) {
	return props as Required<StoryContentsProps>;
}

function StoryContents(props: StoryContentsProps) {
	const theme = useTheme();
	const selectedEntry = useSelector(selectStorySelected);
	const entry = useSelectorCreator(selectPreview, selectedEntry);
	const isLightColor = useSelector(selectIsLightBackground);

	return (
		<Div
			key="StoryContents"
			BackgroundTransparency={0}
			BackgroundColor3={theme.StoryPanel[isLightColor ? "LightColor" : "DarkColor"]}
			LayoutOrder={1}
		>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<BackgroundPattern />
			<Div key="StoryFrame">
				<TopList />
				<StoryTitle />
				<StoryPanelProvider>
					<PanelRender PreviewEntry={entry} />
				</StoryPanelProvider>
			</Div>
		</Div>
	);
}

export default StoryContents;
