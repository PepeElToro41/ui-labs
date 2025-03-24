import React from "@rbxts/react";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import DropShadow from "UI/Utils/DropShadow";
import { IsCanaryPlugin } from "Utils/MiscUtils";

interface LogoProps {}

function Logo(props: LogoProps) {
	const theme = useTheme();
	const plugin = usePlugin();
	const canary = IsCanaryPlugin(plugin);

	return (
		<Div key={"Logo"} Size={UDim2.fromOffset(28, 28)}>
			<imagelabel
				key={"Logo"}
				ImageColor3={theme.Topbar.Logo}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromOffset(24, 24)}
				Image={"rbxassetid://18977714894"}
			/>
			<imagelabel
				key={"Canary"}
				ImageColor3={theme.Topbar.CanaryGear}
				Position={new UDim2(1, 2, 1, 1)}
				AnchorPoint={new Vector2(1, 1)}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(18, 18)}
				Image={"rbxassetid://129671050041899"}
				Visible={canary}
			/>
			<DropShadow Elevation={new Vector2(4, 4)} Transparency={0.9} />
		</Div>
	);
}

export default Logo;
