import React, { useCallback } from "@rbxts/react";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectSelectTool } from "Reflex/Interface";

function SelectElements(props: ToolButtonProps) {
	const { setSelectTool } = useProducer<RootProducer>();
	const selectTool = useSelector(selectSelectTool);

	const OnSetSelectTool = useCallback(() => {
		setSelectTool(!selectTool);
	}, [selectTool]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="SelectElements"
			Description="Select Elements"
			Active={selectTool}
			OnClick={OnSetSelectTool}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default SelectElements;
