import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Configs from "Plugin/Configs";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface BrandingProps {}

function setProps(props: BrandingProps) {
	return props as Required<BrandingProps>;
}

function Branding(setprops: BrandingProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	const version = Configs.Version;

	return (
		<Div key="Branding" Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
			<LeftList VerticalAlignment={"Center"} Padding={new UDim(0, 7)}></LeftList>
			<Sprite Sprite={"UILogo"} ImageProps={{ ImageColor3: theme.Topbar.Logo, Size: UDim2.fromOffset(28, 28) }}></Sprite>
			<Text
				key="PluginName"
				TextSize={16}
				Weight="Bold"
				TextXAlignment={"Left"}
				Text={Configs.PluginName}
				Size={new UDim2(0, 60, 1, 0)}
			/>
			<Text
				key="VersionIndex"
				Text={`v${version.Mayor}.${version.Minor}.${version.Fix}`}
				TextSize={10}
				Weight="Light"
				TextColor3={theme.Text.Disabled}
				Size={new UDim2(1, 0, 1, 0)}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</Div>
	);
}

export default Branding;
