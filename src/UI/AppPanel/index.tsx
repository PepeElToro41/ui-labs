import React from "@rbxts/react";
import FrameFill from "UI/Holders/FrameFill";
import SidePanel from "UI/SidePanel";
import StoryPanel from "UI/StoryPanel";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";

interface AppPanelProps {}

function setProps(props: AppPanelProps) {
	return props as Required<AppPanelProps>;
}

function AppPanel(setprops: AppPanelProps) {
	return (
		<Div key="AppPanel">
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<LeftList />
			<SidePanel />
			<StoryPanel />
		</Div>
	);
}
export default AppPanel;
