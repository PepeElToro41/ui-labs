import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectPopup } from "Reflex/Overlay";
import { Div } from "UI/Styles/Div";

import DescriptionDisplay from "./DescriptionDisplay";
import MouseIconActions from "./MouseIconActions";

interface OverlayControlProps {}

function setProps(props: OverlayControlProps) {
	return props as Required<OverlayControlProps>;
}

function OverlayControl(setprops: OverlayControlProps) {
	const props = setProps(setprops);
	const popup = useSelector(selectPopup);

	return (
		<Div key="Overlays" ZIndex={4}>
			<DescriptionDisplay key={"DescriptionDisplay"} />
			<MouseIconActions />
			{popup ? popup.Element : undefined}
		</Div>
	);
}

export default OverlayControl;
