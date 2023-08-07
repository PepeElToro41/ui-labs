import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import TabItem from "./TabItem";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Div from "UI/Styles/Div";
import RightList from "UI/Styles/List/RightList";

interface ControlTabsProps {}

function setProps(props: ControlTabsProps) {
	return props as Required<ControlTabsProps>;
}

function ControlTabsCreate(setprops: ControlTabsProps) {
	const props = setProps(setprops as Required<ControlTabsProps>);
	const theme = useTheme();
	return (
		<frame Key="ControlTabs" BackgroundColor3={theme.ActionsPanel.TabsBackground} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 26)}>
			<Div Key="LeftTabs">
				<LeftList VerticalAlignment={"Bottom"} Padding={new UDim(0, 1)} />
				<Padding PaddingX={1} />
				<TabItem Key="Summary" TabName="Summary" Active={true} />
				<TabItem Key="Controls" TabName="Controls" />
				<TabItem Key="Actions" TabName="Actions" />
			</Div>
			<Div Key="RightTabs">
				<RightList />
			</Div>
		</frame>
	);
}
const ControlTabs = withHooks(ControlTabsCreate);

export = ControlTabs;
