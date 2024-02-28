import Roact, { useMemo } from "@rbxts/roact";
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

function Unknown(setprops: UnknownProps) {
	const props = setProps(setprops);
	const theme = useTheme();

	const children = useMemo(() => {
		return props.Node.Children.map((child, index) => {
			return <Story Node={child} Order={index} Visible={true} Unknown={true} />;
		});
	}, [props.Node.Children]);
	return (
		<ChildrenHolder
			Order={props.Order}
			Name={props.Node.Instance}
			Sprite={"FolderIcon"}
			SpriteColor={theme.Nodes.Normal.FolderIcon.Disabled}
			Unknown={true}
			Children={children}
		></ChildrenHolder>
	);
}

export default Unknown;
