import Roact from "@rbxts/roact";
import FrameFill from "UI/Holders/FrameFill";
import ActionsPanel from "UI/ActionsPanel";
import BackgroundPattern from "./BackgroundPattern";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { withHooks } from "@rbxts/roact-hooked";
import StoryTitle from "./StoryTitle";
import { Div } from "UI/Styles/Div";
import List from "UI/Styles/List";
import PreviewHandler from "UI/StoryPreview/PreviewControl";

interface StoryPanelProps {}

function setProps(props: StoryPanelProps) {
	return props as Required<StoryPanelProps>;
}

function StoryPanelCreate(setprops: StoryPanelProps) {
	const props = setProps(setprops as Required<StoryPanelProps>);
	const theme = useTheme();
	return (
		<FrameFill Key="StoryPanel" FrameProps={{ BackgroundTransparency: 0, BackgroundColor3: theme.StoryPanel.Color, LayoutOrder: 1 }}>
			<BackgroundPattern />
			<Div Key="StoryFrame">
				<List />
				<StoryTitle />
				<PreviewHandler />
			</Div>
			<ActionsPanel />
		</FrameFill>
	);
}

const StoryPanel = withHooks(StoryPanelCreate);

export = StoryPanel;
