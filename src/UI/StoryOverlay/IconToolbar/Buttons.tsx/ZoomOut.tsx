import React, { useCallback } from "@rbxts/react";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer } from "@rbxts/react-reflex";
import SpriteButton from "UI/Utils/SpriteButton";

function ZoomOut(props: ToolButtonProps) {
	const { addZoom } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomOut = useCallback(() => {
		addZoom(entry.Key, -10);
	}, [entry]);
	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="ZoomOut"
			Description="Zoom Out"
			OnClick={OnZoomOut}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default ZoomOut;
