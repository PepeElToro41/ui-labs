import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import ChildrenHolder from ".";
import Story from "../Story";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface FolderProps {
	Order: number;
	Node: FolderNode;
}

function setProps(props: FolderProps) {
	return props as Required<FolderProps>;
}

function FolderCreate(setprops: FolderProps) {
	const props = setProps(setprops as Required<FolderProps>);
	const theme = useTheme();

	const children = useMemo(() => {
		return props.Node.Children.map((child, index) => {
			if ("Children" in child) {
				return <Folder Node={child} Order={index}></Folder>;
			} else {
				return <Story Node={child} Order={index}></Story>;
			}
		});
	}, [props.Node.Children]);

	return (
		<ChildrenHolder
			Name={props.Node.Instance}
			Order={props.Order}
			Sprite={"FolderIcon"}
			SpriteColor={theme.Nodes.Normal.FolderIcon.Color}
			Children={children}
		></ChildrenHolder>
	);
}
const Folder = withHooks(FolderCreate);

export = Folder;
