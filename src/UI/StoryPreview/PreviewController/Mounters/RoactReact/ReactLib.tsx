import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface ReactLibProps {
	Result: MountResults["ReactLib"];
	MountFrame: Frame;
}

function setProps(props: ReactLibProps) {
	return props as Required<ReactLibProps>;
}

function ReactLibCreate(setprops: ReactLibProps) {
	const props = setProps(setprops as Required<ReactLibProps>);
	return undefined;
}
const ReactLib = withHooks(ReactLibCreate);

export = ReactLib;
