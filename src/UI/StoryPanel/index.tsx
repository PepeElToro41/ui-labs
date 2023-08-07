import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import FrameFill from "UI/Holders/FrameFill";
import StoryName from "./StoryName";
import ActionsPanel from "UI/ActionsPanel";

interface StoryPanelProps {}

function setProps(props: StoryPanelProps) {
	return props as Required<StoryPanelProps>;
}

function StoryPanelCreate(setprops: StoryPanelProps) {
	const props = setProps(setprops as Required<StoryPanelProps>);
	const theme = useTheme();
	return (
		<FrameFill Key="StoryPanel" FrameProps={{ BackgroundTransparency: 0, BackgroundColor3: theme.StoryPanel.Color, LayoutOrder: 1 }}>
			<imagelabel
				Key={"Background"}
				Image={"rbxassetid://13745469099"}
				ScaleType={"Tile"}
				TileSize={UDim2.fromOffset(90, 90)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				ImageColor3={theme.StoryPanel.PatternColor}
				ImageTransparency={theme.StoryPanel.PatternTransparency}
				ZIndex={-1}
			></imagelabel>
			<StoryName></StoryName>
			<ActionsPanel></ActionsPanel>
		</FrameFill>
	);
}
const StoryPanel = withHooks(StoryPanelCreate);

export = StoryPanel;
