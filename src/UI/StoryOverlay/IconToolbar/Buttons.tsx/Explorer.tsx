import React, { useCallback } from "@rbxts/react";
import { ToolButtonProps } from "../ToolButtonsList";
import { Selection } from "@rbxts/services";
import SpriteButton from "UI/Utils/SpriteButton";

function Explorer(props: ToolButtonProps) {
	const entry = props.PreviewEntry;

	const OnViewOnExplorer = useCallback(() => {
		if (entry.OverrideHolder) {
			Selection.Set([entry.OverrideHolder]);
		} else {
			if (!entry.Holder) return;
			Selection.Set([entry.Holder!]);
		}
	}, [entry]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="ViewOnExplorer"
			Shortcut={Enum.KeyCode.E}
			Description="View On Explorer"
			OnClick={OnViewOnExplorer}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default Explorer;
