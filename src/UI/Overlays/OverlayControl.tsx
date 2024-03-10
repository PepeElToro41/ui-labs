import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectOverlay } from "Reflex/Overlay";
import { Div } from "UI/Styles/Div";
import DescriptionDisplay from "./DescriptionDisplay";

interface OverlayControlProps {}

function setProps(props: OverlayControlProps) {
	return props as Required<OverlayControlProps>;
}

function OverlayControl(setprops: OverlayControlProps) {
	const props = setProps(setprops);
	const overlay = useSelector(selectOverlay);

	return (
		<Div key="Overlays" ZIndex={4}>
			<DescriptionDisplay key={"DescriptionDisplay"} />
			{overlay ? overlay.Element : undefined}
		</Div>
	);
}

export default OverlayControl;
