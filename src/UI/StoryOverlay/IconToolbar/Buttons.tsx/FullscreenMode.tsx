import React, { useCallback } from "@rbxts/react";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectFullscreen } from "Reflex/Interface";
import Divisor from "UI/Utils/Divisor";

function FullscreenMode(props: ToolButtonProps) {
	const { setFullscreen } = useProducer<RootProducer>();
	const fullscreen = useSelector(selectFullscreen);

	const OnSetFullscreen = useCallback(() => {
		setFullscreen(!fullscreen);
	}, [fullscreen]);

	return (
		<React.Fragment>
			<SpriteButton
				ButtonName={props.ButtonName}
				Sprite="FullscreenMode"
				Description="Fullscreen Mode"
				Active={fullscreen}
				OnClick={OnSetFullscreen}
				OnRightClick={props.OnRightClick}
				Order={props.Order}
			/>
			{props.Order > 0 ? <Divisor Direction="X" Order={props.Order - 1} /> : undefined}
		</React.Fragment>
	);
}

export default FullscreenMode;
