import React from "@rbxts/react";
import { useButtonElements } from "UI/StoryOverlay/IconToolbar/Utils";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import TopList from "UI/Styles/List/TopList";
import Divisor from "UI/Utils/Divisor";

interface AnchoredToolbarProps {
	PreviewEntry: PreviewEntry;
}

function AnchoredToolbar(props: AnchoredToolbarProps) {
	const buttonElements = useButtonElements(props.PreviewEntry);

	return (
		<frame Size={new UDim2(0, 35, 1, 0)} BackgroundTransparency={0.2} BackgroundColor3={Color3.fromRGB(26, 26, 33)} BorderSizePixel={0}>
			<Divisor Direction="Y" Position={UDim2.fromScale(1, 0.5)} />
			<Div>
				{buttonElements}
				<TopList Padding={new UDim(0, 2)} />
			</Div>
		</frame>
	);
}

export default AnchoredToolbar;
