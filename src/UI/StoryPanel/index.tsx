import Roact from "@rbxts/roact";
import FrameFill from "UI/Holders/FrameFill";
import StoryName from "./StoryName";
import ActionsPanel from "UI/ActionsPanel";
import BackgroundPattern from "./BackgroundPattern";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { withHooks } from "@rbxts/roact-hooked";

interface StoryPanelProps {}

function setProps(props: StoryPanelProps) {
	return props as Required<StoryPanelProps>;
}

function StoryPanelCreate(setprops: StoryPanelProps) {
	const props = setProps(setprops as Required<StoryPanelProps>);
	const theme = useTheme();
	return (
		<FrameFill Key="StoryPanel" FrameProps={{ BackgroundTransparency: 0, BackgroundColor3: theme.StoryPanel.Color, LayoutOrder: 1 }}>
			<BackgroundPattern></BackgroundPattern>
			<StoryName></StoryName>
			<ActionsPanel></ActionsPanel>
		</FrameFill>
	);
}

const StoryPanel = withHooks(StoryPanelCreate);

export = StoryPanel;
