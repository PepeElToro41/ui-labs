import React, { useCallback } from "@rbxts/react";
import { ToolButtonProps } from "../ToolButtonsList";
import SpriteButton from "UI/Utils/SpriteButton";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectIsLightBackground } from "Reflex/Theme";

function LightBackground(props: ToolButtonProps) {
	const entry = props.PreviewEntry;
	const isLightBackground = useSelector(selectIsLightBackground);
	const { setIsLightBackground } = useProducer<RootProducer>();

	const OnLightBackground = useCallback(() => {
		setIsLightBackground(!isLightBackground);
	}, [isLightBackground]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="LightBackground"
			Active={isLightBackground}
			Description="Invert Background"
			OnClick={OnLightBackground}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default LightBackground;
