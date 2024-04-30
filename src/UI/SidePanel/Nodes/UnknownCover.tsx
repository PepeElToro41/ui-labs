import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";

interface UnknownCoverProps {}

function UnknownCover(props: UnknownCoverProps) {
	const theme = useTheme();

	return (
		<frame BackgroundColor3={theme.SidePanel} BackgroundTransparency={0.5} Size={UDim2.fromScale(1, 1)} ZIndex={2}>
			<Corner Radius={6} />
		</frame>
	);
}

export default UnknownCover;
