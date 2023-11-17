import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface FusionLibProps {}

function setProps(props: FusionLibProps) {
	return props as Required<FusionLibProps>;
}

function FusionLibCreate(setprops: FusionLibProps) {
	const props = setProps(setprops as Required<FusionLibProps>);
	return undefined;
}
const FusionLib = withHooks(FusionLibCreate);

export = FusionLib;
