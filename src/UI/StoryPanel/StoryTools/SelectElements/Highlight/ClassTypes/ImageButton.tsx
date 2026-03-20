import React from "@rbxts/react";

import Base from "../Base";
import { HighlightProps } from "../Mapping";

function ImageButtonHighlight(props: HighlightProps<ImageButton>) {
	return (
		<Base
			key={"ImageButtonHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(38, 227, 84)}
			Title="ImageButton"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default ImageButtonHighlight;
