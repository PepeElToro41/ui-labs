import React from "@rbxts/react";
import { HighlightProps } from "../Mapping";
import Base from "../Base";

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
