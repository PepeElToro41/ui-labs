import React from "@rbxts/react";
import { Div } from "UI/Styles/Div";

interface FunctionRendererProps {
	Value: Callback;
	IsDescription: boolean;
}

function setProps(props: FunctionRendererProps) {
	return props;
}

function FunctionRenderer(setprops: FunctionRendererProps) {
	const props = setProps(setprops);
	return (
		<Div Size={UDim2.fromOffset(70, 15)}>
			<imagelabel
				AnchorPoint={props.IsDescription ? new Vector2(1, 0.5) : new Vector2(0, 0.5)}
				Position={props.IsDescription ? new UDim2(1, 2, 0.5, 0) : new UDim2(0, -2, 0.5, 0)}
				Size={UDim2.fromOffset(15, 15)}
				Image={"rbxassetid://16160973526"}
				ImageTransparency={props.IsDescription ? 0.4 : 0}
				BackgroundTransparency={1}
			/>
		</Div>
	);
}

export default FunctionRenderer;
