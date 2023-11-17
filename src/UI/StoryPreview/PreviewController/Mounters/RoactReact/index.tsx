import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface RoactReactProps {}

function setProps(props: RoactReactProps) {
	return props as Required<RoactReactProps>;
}

//Works for both Roact and React libraries
function RoactReactCreate(setprops: RoactReactProps) {
	const props = setProps(setprops as Required<RoactReactProps>);
	return <></>;
}
const RoactReact = withHooks(RoactReactCreate);

export = RoactReact;
