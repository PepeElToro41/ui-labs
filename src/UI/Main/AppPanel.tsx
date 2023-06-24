import Roact from "@rbxts/roact";
import SideBar from "./SideBar";
import Configs from "Plugin/Configs";
import { withHooks, withHooksPure } from "@rbxts/roact-hooked";
import StoryPanel from "./StoryPanel";

interface AppPanelProps {}

function setProps(props: AppPanelProps) {
	return props;
}

function AppPanelCreate(setprops: AppPanelProps) {
	const props = identity<Required<AppPanelProps>>(setProps(setprops) as Required<AppPanelProps>);
	return (
		<frame
			Key="AppPanel"
			BackgroundTransparency={1}
			Position={new UDim2(0, 0, 0, 35)}
			Size={new UDim2(1, 0, 1, -35)}
		>
			<uilistlayout FillDirection={Enum.FillDirection.Horizontal} SortOrder={Enum.SortOrder.LayoutOrder} />
			<StoryPanel></StoryPanel>
			<SideBar></SideBar>
		</frame>
	);
}
const AppPanel = withHooksPure(AppPanelCreate);

export = AppPanel;
