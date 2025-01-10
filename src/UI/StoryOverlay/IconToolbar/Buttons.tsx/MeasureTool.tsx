import React, { useCallback } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectMeasureTool } from "Reflex/Interface";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";

function MeasureTool(props: ToolButtonProps) {
	const { setMeasureTool } = useProducer<RootProducer>();
	const measureTool = useSelector(selectMeasureTool);

	const OnSetMeasureTool = useCallback(() => {
		setMeasureTool(!measureTool);
	}, [measureTool]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="MeasureTool"
			Description="Measure Tool"
			Active={measureTool}
			OnClick={OnSetMeasureTool}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
			Shortcut={Enum.KeyCode.M}
		/>
	);
}

export default MeasureTool;
