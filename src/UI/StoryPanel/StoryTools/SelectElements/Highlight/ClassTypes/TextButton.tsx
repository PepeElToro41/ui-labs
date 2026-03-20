import React from "@rbxts/react";

import Base from "../Base";
import { HighlightProps } from "../Mapping";

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
