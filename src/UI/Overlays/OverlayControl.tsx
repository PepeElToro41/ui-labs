import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { selectOverlay } from "Reflex/Overlay";
import { Div } from "UI/Styles/Div";

interface OverlayControlProps {}

function setProps(props: OverlayControlProps) {
	return props as Required<OverlayControlProps>;
}

function OverlayControlCreate(setprops: OverlayControlProps) {
	const props = setProps(setprops as Required<OverlayControlProps>);
	const overlay = useSelector(selectOverlay);

	return (
		<Div Key="Overlay" ZIndex={4}>
			{overlay ? overlay.Element : undefined}
		</Div>
	);
}
const OverlayControl = withHooks(OverlayControlCreate);

export = OverlayControl;
