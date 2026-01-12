import React from "@rbxts/react";

import Base from "../Base";
import { HighlightProps } from "../Mapping";

function FrameHighlight(props: HighlightProps<Frame>) {
	return (
		<Base
			key={"FrameHighlight"}
			Inset={props.Inset}
			Color={Color3.fromRGB(242, 153, 48)}
			Title="Frame"
			UIComponent={props.UIComponent}
			Holder={props.Holder}
		></Base>
	);
}

export default FrameHighlight;
