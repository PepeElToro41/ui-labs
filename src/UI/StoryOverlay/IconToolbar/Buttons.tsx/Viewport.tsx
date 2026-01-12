import Immut from "@rbxts/immut";
import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import SpriteButton from "UI/Utils/SpriteButton";

import { ToolButtonProps } from "../ToolButtonsList";

function Viewport(props: ToolButtonProps) {
	const { updateMountData } = useProducer<RootProducer>();
	const entry = props.PreviewEntry;

	const OnViewOnViewport = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.OnViewport = !draft.OnViewport;
			})
		);
	}, [entry]);

	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="ViewOnViewport"
			Shortcut={Enum.KeyCode.Q}
			Description="View On Viewport"
			Active={entry.OnViewport}
			OnClick={OnViewOnViewport}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
		/>
	);
}

export default Viewport;
