import React, { useMemo } from "@rbxts/react";
import { ToolButtonsList } from "../ToolButtonsList";
import { Div } from "UI/Styles/Div";
import Corner from "UI/Styles/Corner";
import TopList from "UI/Styles/List/TopList";
import { useButtonElements } from "../Utils";
import Padding from "UI/Styles/Padding";

interface RenderToolButtonsProps {
	PreviewEntry: PreviewEntry;
	HoverAlpha: React.Binding<UDim2> | UDim2;
}

function RenderToolButtons(props: RenderToolButtonsProps) {
	const buttonElements = useButtonElements(props.PreviewEntry);

	return (
		<Div key={"ButtonsHolder"} Position={props.HoverAlpha} BackgroundTransparency={0.2} BackgroundColor3={Color3.fromRGB(26, 26, 33)}>
			<Corner Radius={6} />
			<Padding Padding={2} />
			<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 2)} />
			{buttonElements}
		</Div>
	);
}

export default RenderToolButtons;
