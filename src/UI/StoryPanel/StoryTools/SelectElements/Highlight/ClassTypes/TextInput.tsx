import React from "@rbxts/react";

import Base from "../Base";
import { HighlightProps } from "../Mapping";

function TextBoxHighlight(props: HighlightProps<TextBox>) {
	return (
		<Base
			key={"TextBoxHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(97, 71, 242)}
			Title="TextBox"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default TextBoxHighlight;
