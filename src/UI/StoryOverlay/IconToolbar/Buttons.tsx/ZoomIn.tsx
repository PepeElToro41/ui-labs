import React, { useCallback } from "@rbxts/react";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer } from "@rbxts/react-reflex";

function ZoomIn(props: ToolButtonProps) {
	const { addZoom } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomIn = useCallback(() => {
		addZoom(props.PreviewEntry.Key, 10);
	}, [entry]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="ZoomIn"
			Description="Zoom In"
			OnClick={OnZoomIn}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default ZoomIn;
