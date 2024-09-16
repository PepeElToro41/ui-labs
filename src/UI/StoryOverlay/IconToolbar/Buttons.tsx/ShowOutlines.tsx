import React, { useCallback } from "@rbxts/react";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectShowOutlines } from "Reflex/Interface";

function ShowOutlines(props: ToolButtonProps) {
	const { setShowOutlines } = useProducer<RootProducer>();
	const showOutlines = useSelector(selectShowOutlines);

	const OnSetShowOutlines = useCallback(() => {
		setShowOutlines(!showOutlines);
	}, [showOutlines]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="ShowOutlines"
			Description="Show Outlines"
			Active={showOutlines}
			OnClick={OnSetShowOutlines}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default ShowOutlines;
