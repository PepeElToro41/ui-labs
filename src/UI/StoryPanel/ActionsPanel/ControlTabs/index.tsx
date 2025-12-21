import React, { useMemo } from "@rbxts/react";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import TabItem from "./TabItem";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import RightList from "UI/Styles/List/RightList";

export interface TabEntry {
	DisplayName: string;
	Order?: number;
}

interface ControlTabsProps {
	Tabs: Map<string, TabEntry>;
	RightTabs?: React.ReactNode;
	Selected?: string;
	OnTabSelected: (tabIndex: string) => void;
}

function setProps(props: ControlTabsProps) {
	return props as Required<ControlTabsProps>;
}

function ControlTabs(setprops: ControlTabsProps) {
	const props = setProps(setprops);
	const theme = useTheme();

	const tabs = useMemo(() => {
		const tabItems: ReactChildren = new Map();
		props.Tabs.forEach((tab, index) => {
			const tabItem = (
				<TabItem
					TabName={tab.DisplayName}
					Active={props.Selected === index}
					OnClicked={() => props.OnTabSelected(index)}
					Order={tab.Order}
				/>
			);
			tabItems.set(index, tabItem);
		});
		return tabItems;
	}, [props.Tabs, props.Selected, props.OnTabSelected]);

	return (
		<frame
			key="ControlTabs"
			BackgroundColor3={theme.ActionsPanel.TabsBackground}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 28)}
		>
			<Div key="LeftTabs">
				<LeftList VerticalAlignment={"Bottom"} Padding={new UDim(0, 1)} />
				<Padding PaddingX={1} />
				{tabs}
			</Div>
			<Div key="RightTabs">
				<Padding PaddingX={5} />
				<RightList VerticalAlignment={"Center"} HorizontalAlignment={"Right"} />
				{props.RightTabs ?? []}
			</Div>
		</frame>
	);
}

export default ControlTabs;
