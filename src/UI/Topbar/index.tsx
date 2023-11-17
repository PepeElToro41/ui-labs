import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Branding from "./Branding";
import Padding from "UI/Styles/Padding";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useSelector } from "@rbxts/roact-reflex";
import { selectTheme } from "Reflex/Theme";

interface TopBarProps {}

function setProps(props: TopBarProps) {
	return props as Required<TopBarProps>;
}

function TopBarCreate(setprops: TopBarProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	return (
		<frame Key={"TopBar"} BackgroundColor3={theme.Topbar.Color} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 32)} ZIndex={2}>
			<Padding PaddingX={8}></Padding>
			<Branding></Branding>
		</frame>
	);
}
const TopBar = withHooks(TopBarCreate);

export = TopBar;
