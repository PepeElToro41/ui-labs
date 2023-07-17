import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface RGBAControlProps extends Control.ControlType<number> {}

function setProps(props: RGBAControlProps) {
	return props;
}

function RGBAControlCreate(setprops: RGBAControlProps) {
	const props = identity<Required<RGBAControlProps>>(setProps(setprops) as Required<RGBAControlProps>);
	return <></>;
}
const RGBAControl = withHooks(RGBAControlCreate);

export = RGBAControl;
