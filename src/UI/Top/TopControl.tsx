import Roact from "@rbxts/roact";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { PluginContext } from "UI/Contexts/PluginContext";
import { Detector } from "UI/UIUtils/Styles/Detector";

interface TopControlProps {
	ControlName: string;
	ControlLabel: string;
	Dropdown?: Dropdown.IsTopGroup[];
}

function setProps(props: TopControlProps) {
	return props;
}

function TopControlCreate(setprops: TopControlProps) {
	const props = identity<Required<TopControlProps>>(setProps(setprops) as Required<TopControlProps>);
	const [hovered, setHover] = useState(false);
	const pluginObject = useContext(PluginContext).PluginObject;
	const pluginMouse = pluginObject && pluginObject.GetMouse();
	const theme = useContext(ThemeContext).Theme;
	useEffect(() => {
		if (!pluginMouse) return;
		if (hovered) {
			pluginMouse.Icon = "rbxasset://SystemCursors/PointingHand";
		} else {
			pluginMouse.Icon = "";
		}
	}, [hovered]);
	return (
		<Detector
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={theme.TopControl}
			BackgroundTransparency={hovered ? 0 : 1}
			BorderSizePixel={0}
			Size={new UDim2(0, 0, 1, 0)}
			Active={true}
			Event={{
				MouseEnter: () => setHover(true),
				MouseLeave: () => setHover(false),
				MouseButton1Click: () => {},
			}}
		>
			<uipadding
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 10)}
				PaddingRight={new UDim(0, 10)}
				PaddingTop={new UDim(0, 5)}
			/>
			<textlabel
				AnchorPoint={new Vector2(0, 0.5)}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamMedium}
				Position={new UDim2(0, 0, 0.5, 0)}
				Size={new UDim2(0, 0, 1, 0)}
				Text={props.ControlLabel}
				TextColor3={theme.TextColor}
				TextSize={14}
				TextWrapped={true}
			/>
			<uicorner CornerRadius={new UDim(0, 6)} />
		</Detector>
	);
}
const TopControl = withHooks(TopControlCreate);

export = TopControl;
