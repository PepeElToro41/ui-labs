import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Detector from "UI/Styles/Detector";
import Corner from "UI/Styles/List/Corner";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface TabItemProps {
	TabName: string;
	Active?: boolean;
	OnClicked?: (tabName: string) => void;
}

function setProps(props: TabItemProps) {
	return props as Required<TabItemProps>;
}

function TabItemCreate(setprops: TabItemProps) {
	const props = setProps(setprops as Required<TabItemProps>);
	const theme = useTheme();
	const [hover, setHover] = useState(false);

	return (
		<frame
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={props.Active ? theme.ActionsPanel.Color : theme.ActionsPanel.TabHover}
			BackgroundTransparency={props.Active || hover ? 0 : 1}
			BorderSizePixel={0}
			Size={new UDim2(0, 0, 1, -1)}
		>
			<Text
				Text={props.TabName}
				Weight={"ExtraLight"}
				TextSize={12}
				TextColor3={props.Active ? theme.Text.Color : theme.Text.Disabled}
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				ZIndex={2}
			>
				<Padding PaddingX={10} />
			</Text>
			<Corner Size={4} />
			<Detector
				Event={{
					MouseEnter: () => setHover(true),
					MouseLeave: () => setHover(false),
					MouseButton1Click: () => props.OnClicked(props.TabName),
				}}
			/>
			<frame
				Key={"Cover"}
				BackgroundColor3={props.Active ? theme.ActionsPanel.Color : theme.ActionsPanel.TabHover}
				BackgroundTransparency={props.Active || hover ? 0 : 1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.5)}
				Size={UDim2.fromScale(1, 0.5)}
			/>
		</frame>
	);
}
const TabItem = withHooks(TabItemCreate);

export = TabItem;
