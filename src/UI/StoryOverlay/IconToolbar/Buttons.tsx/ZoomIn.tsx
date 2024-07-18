import React, { useCallback } from "@rbxts/react";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer } from "@rbxts/react-reflex";
import Immut from "@rbxts/immut";

function ZoomIn(props: ToolButtonProps) {
	const { updateMountData } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomIn = useCallback(() => {
		updateMountData(props.PreviewEntry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.Zoom += 10;
			}),
		);
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
