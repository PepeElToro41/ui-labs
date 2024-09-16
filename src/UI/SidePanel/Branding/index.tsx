import React from "@rbxts/react";
import LeftList from "UI/Styles/List/LeftList";
import Logo from "./Logo";
import Text from "UI/Styles/Text";
import Corner from "UI/Styles/Corner";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";

interface BrandingProps {}

function Branding(props: BrandingProps) {
	const theme = useTheme();

	return (
		<Div key={"Branding"} Size={new UDim2(1, 0, 0, 34)}>
			<Div key={"PluginName"} Size={new UDim2(1, -25, 1, 0)} ClipsDescendants={true}>
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 8)} />
				<Logo />
				<Text
					key={"PluginName"}
					TextColor3={theme.Text.Color}
					Text="UI Labs"
					Weight="Bold"
					TextSize={18}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
				<Text
					key={"Version"}
					TextColor3={theme.Text.Disabled}
					Text="v2.0.0"
					Weight="Light"
					TextSize={10}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			</Div>
			<Div
				key={"Options"}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1, 0.5)}
				Size={UDim2.fromOffset(20, 20)}
				AnchorPoint={new Vector2(1, 0.5)}
			>
				<uistroke Thickness={1} Color={theme.Divisor.Color} Transparency={theme.Divisor.Transparency} />
				<Corner Radius={4} />
				<imagelabel
					Image={"rbxassetid://18977916731"}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(16, 16)}
				/>
			</Div>
		</Div>
	);
}

export default Branding;
