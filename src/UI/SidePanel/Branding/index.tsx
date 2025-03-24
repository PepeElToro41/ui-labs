import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Configs from "Plugin/Configs";
import OptionsDropdown from "UI/Overlays/Dropdown/OptionsDropdown";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import { IsCanaryPlugin } from "Utils/MiscUtils";
import Logo from "./Logo";

interface BrandingProps {}

function Branding(props: BrandingProps) {
	const theme = useTheme();
	const plugin = usePlugin();
	const [hovered, hoverApi] = useToggler(false);
	const { setPopup } = useProducer<RootProducer>();
	const mouseOffset = useMouseOffset();
	const isCanary = IsCanaryPlugin(plugin);

	const OnMoreOptions = useCallback(() => {
		const offset = mouseOffset.getValue();

		hoverApi.disable();
		setPopup("OptionsDropdown", <OptionsDropdown Position={offset} />);
	}, []);

	return (
		<Div key={"Branding"} Size={new UDim2(1, 0, 0, 35)}>
			<Div
				key={"PluginName"}
				Size={new UDim2(1, -26, 1, 0)}
				ClipsDescendants={true}
			>
				<LeftList
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 8)}
				/>
				<Logo />
				<Text
					key={"PluginName"}
					TextColor3={theme.Text.Color}
					Text="UI Labs"
					Weight="Bold"
					TextSize={18}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
				<textbox
					TextEditable={false}
					ClearTextOnFocus={false}
					key={"Version"}
					TextColor3={theme.Text.Disabled}
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
					Text={Configs.Version.CanaryCommit}
					TextSize={11}
					Size={UDim2.fromScale(0, 0.4)}
					AutomaticSize={Enum.AutomaticSize.X}
					TextYAlignment={Enum.TextYAlignment.Bottom}
					Visible={isCanary}
				/>
				<Text
					key={"Version"}
					TextColor3={theme.Text.Disabled}
					Text={`v${Configs.Version.Mayor}.${Configs.Version.Minor}.${Configs.Version.Fix}`}
					TextSize={10}
					AutomaticSize={Enum.AutomaticSize.X}
					Visible={!isCanary}
				/>
			</Div>
			<Div
				key={"Options"}
				Position={UDim2.fromScale(1, 0.5)}
				Size={UDim2.fromOffset(20, 20)}
				AnchorPoint={new Vector2(1, 0.5)}
			>
				<Div ZIndex={-1}>
					<Padding Padding={1} />
					<frame
						BackgroundTransparency={hovered ? 0.6 : 1}
						BackgroundColor3={theme.Icon.Color}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
					>
						<Corner Radius={4} />
					</frame>
				</Div>
				<uistroke
					Thickness={1}
					Color={theme.Divisor.Color}
					Transparency={theme.Divisor.Transparency}
				/>
				<Corner Radius={4} />
				<imagelabel
					Image={"rbxassetid://18977916731"}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ImageColor3={hovered ? theme.PureColor.Color : theme.Text.Color}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(16, 16)}
				/>
				<Detector
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnMoreOptions
					}}
				/>
			</Div>
		</Div>
	);
}

export default Branding;
