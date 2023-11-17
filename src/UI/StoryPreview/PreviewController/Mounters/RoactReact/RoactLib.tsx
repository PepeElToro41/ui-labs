import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface RoactLibProps {
	Result: MountResults["RoactLib"];
	MountFrame: Frame;
}

function setProps(props: RoactLibProps) {
	return props as Required<RoactLibProps>;
}

function RoactLibCreate(setprops: RoactLibProps) {
	const props = setProps(setprops as Required<RoactLibProps>);
	return undefined;
}
const RoactLib = withHooks(RoactLibCreate);

export = RoactLib;
