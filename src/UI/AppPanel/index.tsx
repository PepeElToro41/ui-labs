import Roact from "@rbxts/roact";
import FrameFill from "UI/Holders/FrameFill";
import SidePanel from "UI/SidePanel";
import StoryPanel from "UI/StoryPanel";
import LeftList from "UI/Styles/List/LeftList";

interface AppPanelProps {}

function setProps(props: AppPanelProps) {
	return props as Required<AppPanelProps>;
}

function AppPanel(setprops: AppPanelProps) {
	return (
		<FrameFill Key="AppPanel" FillDir="Y">
			<LeftList />
			<SidePanel />
			<StoryPanel />
		</FrameFill>
	);
}
export default AppPanel;
