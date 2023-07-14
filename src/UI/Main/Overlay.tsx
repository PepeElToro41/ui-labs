import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { Div } from "UI/UIUtils/Styles/Div";

interface OverlayProps extends PropsWithChildren {}

function setProps(props: OverlayProps) {
	return props;
}

function OverlayCreate(setprops: OverlayProps) {
	const props = identity<Required<OverlayProps>>(setProps(setprops) as Required<OverlayProps>);
	return (
		<>
			<Div Key="Overlay" ZIndex={3}></Div>
			{props[Children]}
		</>
	);
}
const Overlay = withHooks(OverlayCreate);

export = Overlay;
