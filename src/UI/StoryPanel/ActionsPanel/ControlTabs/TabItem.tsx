import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface TabItemProps {
	TabName: string;
	Active: boolean;
	Order?: number;
	OnClicked: () => void;
}

function setProps(props: TabItemProps) {
	return props as Required<TabItemProps>;
}

function TabItem(setprops: TabItemProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	const [hover, hoverApi] = useToggler(false);

	return (
		<frame
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={props.Active ? theme.ActionsPanel.Color : theme.ActionsPanel.TabHover}
			BackgroundTransparency={props.Active || hover ? 0 : 1}
			BorderSizePixel={0}
			LayoutOrder={props.Order ?? 0}
			Size={new UDim2(0, 0, 1, -1)}
		>
			<Text
				Text={props.TabName}
				Weight={"Medium"}
				TextSize={13}
				TextColor3={props.Active ? theme.Text.Color : theme.Text.Disabled}
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				ZIndex={2}
			>
				<Padding PaddingX={13} />
			</Text>
			<Corner Radius={6} />
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: props.OnClicked
				}}
			/>
			<frame
				key={"Cover"}
				BackgroundColor3={props.Active ? theme.ActionsPanel.Color : theme.ActionsPanel.TabHover}
				BackgroundTransparency={props.Active || hover ? 0 : 1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.5)}
				Size={UDim2.fromScale(1, 0.5)}
			/>
		</frame>
	);
}

export default TabItem;
