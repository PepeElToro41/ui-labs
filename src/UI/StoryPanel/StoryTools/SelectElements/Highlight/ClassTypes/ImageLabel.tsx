import React from "@rbxts/react";
import { HighlightProps } from "../Mapping";
import Base from "../Base";

function ImageLabelHighlight(props: HighlightProps<ImageLabel>) {
	return (
		<Base
			key={"ImageLabelHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(38, 227, 84)}
			Title="ImageLabel"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default ImageLabelHighlight;
