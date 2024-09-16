import React from "@rbxts/react";
import { HighlightProps } from "../Mapping";
import Base from "../Base";

function TextLabelHighlight(props: HighlightProps<TextLabel>) {
	return (
		<Base
			key={"TextLabelHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(28, 133, 232)}
			Title="TextLabel"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default TextLabelHighlight;
