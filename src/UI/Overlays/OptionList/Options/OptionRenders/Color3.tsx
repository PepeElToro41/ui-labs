import React from "@rbxts/react";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";

interface Color3RendererProps {
	Value: Color3;
	IsDescription: boolean;
}

function setProps(props: Color3RendererProps) {
	return props;
}

function Color3Renderer(setprops: Color3RendererProps) {
	const props = setProps(setprops);
	return (
		<Div Size={new UDim2(0, 80, 1, 0)}>
			<frame
				AnchorPoint={props.IsDescription ? new Vector2(1, 0.5) : new Vector2(0, 0.5)}
				Position={props.IsDescription ? new UDim2(1, 2, 0.5, 0) : new UDim2(0, -2, 0.5, 0)}
				BackgroundColor3={props.Value}
				Size={UDim2.fromOffset(14, 14)}
			>
				<Rounder />
			</frame>
		</Div>
	);
}

export default Color3Renderer;
