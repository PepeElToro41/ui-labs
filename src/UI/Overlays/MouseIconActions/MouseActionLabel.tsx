import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

import { MouseActionInfo } from "./ActionsList";

interface MouseActionLabelProps {
	ActionInfo: MouseActionInfo;
}

function MouseActionLabel(props: MouseActionLabelProps) {
	const theme = useTheme();

	return (
		<imagelabel
			Image={props.ActionInfo.Image}
			ImageColor3={theme.Icon.Color}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(16, 16)}
		/>
	);
}

export default MouseActionLabel;
