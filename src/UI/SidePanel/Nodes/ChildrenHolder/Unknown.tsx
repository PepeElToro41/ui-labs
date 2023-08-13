import Roact from "@rbxts/roact";
import { useEffect, useMemo, withHooks } from "@rbxts/roact-hooked";
import ChildrenHolder from ".";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Story from "../Story";

interface UnknownProps {
	Order: number;
	Node: UnknownNode;
}

function setProps(props: UnknownProps) {
	return props as Required<UnknownProps>;
}

function UnknownCreate(setprops: UnknownProps) {
	const props = setProps(setprops as Required<UnknownProps>);
	const theme = useTheme();

	const children = useMemo(() => {
		return props.Node.children.map((child, index) => {
			return <Story Node={child} Order={index} Visible={true} Unknown={true} />;
		});
	}, [props.Node.children]);

	return (
		<ChildrenHolder
			Order={props.Order}
			Name={props.Node.instance}
			Sprite={"FolderIcon"}
			SpriteColor={theme.Nodes.Normal.FolderIcon.Disabled}
			Unknown={true}
			Children={children}
		></ChildrenHolder>
	);
}
const Unknown = withHooks(UnknownCreate);

export = Unknown;
