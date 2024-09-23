import React, { useCallback } from "@rbxts/react";
import { ToolButtonProps } from "../ToolButtonsList";
import SpriteButton from "UI/Utils/SpriteButton";
function Reload(props: ToolButtonProps) {
	const entry = props.PreviewEntry;

	const OnReload = useCallback(() => {
		const reloader = entry.HotReloader;
		if (reloader) {
			reloader.Reload();
		}
	}, [entry]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="Reload"
			Shortcut={Enum.KeyCode.R}
			Description="Reload"
			OnClick={OnReload}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default Reload;
