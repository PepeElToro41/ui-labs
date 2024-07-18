import React, { useCallback } from "@rbxts/react";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer } from "@rbxts/react-reflex";
import Immut from "@rbxts/immut";
import SpriteButton from "UI/Utils/SpriteButton";

function ZoomOut(props: ToolButtonProps) {
	const { updateMountData } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomOut = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.Zoom -= 10;
			}),
		);
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
