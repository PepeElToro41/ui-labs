import React from "@rbxts/react";
import { Div } from "UI/Styles/Div";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";

interface PanelToolsProps {}

function setProps(props: PanelToolsProps) {
	return props as Required<PanelToolsProps>;
}

//This one should hold the buttons for the explorer tools, but there's none yet
function PanelTools(setprops: PanelToolsProps) {
	const props = setProps(setprops);
	return (
		<Div
			key={"PanelTools"}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			LayoutOrder={2}
			Size={new UDim2(1, -10, 0, 20)}
		>
			<Text key={"Label"} Text={"Story Explorer"} AutomaticSize={Enum.AutomaticSize.X} Size={UDim2.fromScale(0, 0.9)} />
			<Divisor Direction={"X"} Position={new UDim2(0.5, 0, 1, 5)} />
		</Div>
	);
}

export default PanelTools;
