import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import DropShadow from "UI/Utils/DropShadow";

interface LogoProps {}

function Logo(props: LogoProps) {
	const theme = useTheme();

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
			<DropShadow Elevation={new Vector2(4, 4)} />
		</Div>
	);
}

export default Logo;
