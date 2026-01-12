import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Padding from "UI/Styles/Padding";

import Branding from "./Branding";

interface TopBarProps {}

function setProps(props: TopBarProps) {
	return props as Required<TopBarProps>;
}

function TopBar(setprops: TopBarProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	return (
		<frame
			key={"TopBar"}
			BackgroundColor3={theme.Topbar.Color}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 32)}
			ZIndex={2}
		>
			<Padding PaddingX={8}></Padding>
			<Branding></Branding>
		</frame>
	);
}

export default TopBar;
