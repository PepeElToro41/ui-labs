import React from "@rbxts/react";
import { HighlightProps } from "../Mapping";
import Base from "../Base";

function TextButtonHighlight(props: HighlightProps<TextButton>) {
	return (
		<Base
			key={"TextButtonHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(28, 133, 232)}
			Title="TextButton"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default TextButtonHighlight;
