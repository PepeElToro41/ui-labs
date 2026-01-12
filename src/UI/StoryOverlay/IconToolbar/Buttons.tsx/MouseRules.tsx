import React, { useCallback } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectMouseRules } from "Reflex/Interface";
import SpriteButton from "UI/Utils/SpriteButton";

import { ToolButtonProps } from "../ToolButtonsList";

function MouseRules(props: ToolButtonProps) {
	const { setMouseRules } = useProducer<RootProducer>();
	const mouseRules = useSelector(selectMouseRules);

	const OnSetMouseRules = useCallback(() => {
		setMouseRules(!mouseRules);
	}, [mouseRules]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="MouseRules"
			Description="Mouse Rules"
			Active={mouseRules}
			OnClick={OnSetMouseRules}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
			Shortcut={Enum.KeyCode.R}
			ShortcutModifier={Enum.ModifierKey.Shift}
		/>
	);
}

export default MouseRules;
