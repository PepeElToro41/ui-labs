import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Configs from "Plugin/Configs";
import Div from "UI/Styles/Div";
import List from "UI/Styles/List";
import LeftList from "UI/Styles/List/LeftList";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface BrandingProps {}

function setProps(props: BrandingProps) {
	return props as Required<BrandingProps>;
}

function BrandingCreate(setprops: BrandingProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	return (
		<Div Key="Branding" Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
			<LeftList VerticalAlignment={"Center"} Padding={new UDim(0, 5)}></LeftList>
			<Sprite Sprite={"UILogo"} ImageProps={{ ImageColor3: theme.Topbar.Logo, Size: UDim2.fromOffset(28, 28) }}></Sprite>
			<Text Key="PluginName" Weight="Bold" TextXAlignment={"Left"} Text={Configs.PluginName} Size={new UDim2(0, 60, 1, 0)} />
		</Div>
	);
}
const Branding = withHooks(BrandingCreate);

export = Branding;
