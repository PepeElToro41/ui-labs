import Vide from "@rbxts/vide";
import Div from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Logo from "./Logo";
import Frame from "UI/Styles/Frame";
import Image from "UI/Styles/Image";
import Corner from "UI/Styles/Corner";
import { useTheme } from "Contexts/ThemeProvider";
import Text from "UI/Styles/Text";
import { Presets } from "UI/Utils/PropDriller";

interface BrandingProps {}

function Branding(props: BrandingProps) {
	const theme = useTheme();

	return (
		<Div Name={"Branding"} Size={new UDim2(1, 0, 0, 34)}>
			<Div Name={"PluginName"} Size={new UDim2(1, -25, 1, 0)} ClipsDescendants={true}>
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 8)} />
				<Logo />
				<Text
					Name={"PluginName"}
					TextColor3={theme("Text")}
					Text="UI Labs"
					Weight="Bold"
					TextSize={18}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
				<Text
					Name={"Version"}
					TextColor3={theme("TextDisabled")}
					Text="v2.0.0"
					Weight="Light"
					TextSize={10}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			</Div>
			<Frame
				Name={"Options"}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1, 0.5)}
				Size={UDim2.fromOffset(20, 20)}
				AnchorPoint={new Vector2(1, 0.5)}
			>
				<uistroke Thickness={1} Color={theme("Border")} />
				<Corner Radius={4} />
				<Image Image={"rbxassetid://18977916731"} {...Presets.Centered} Size={UDim2.fromOffset(16, 16)} />
			</Frame>
		</Div>
	);
}

export default Branding;
