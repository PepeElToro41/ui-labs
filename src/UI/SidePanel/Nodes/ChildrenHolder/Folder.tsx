import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface FolderProps {}

function setProps(props: FolderProps) {
	return props as Required<FolderProps>;
}

function FolderCreate(setprops: FolderProps) {
	const props = setProps(setprops as Required<FolderProps>);
	return <></>;
}
const Folder = withHooks(FolderCreate);

export = Folder;
