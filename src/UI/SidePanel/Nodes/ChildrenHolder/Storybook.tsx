import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import ChildrenHolder from ".";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Story from "../Story";
import Folder from "./Folder";

interface StorybookProps {
	Node: StorybookNode;
	Order: number;
}

function setProps(props: StorybookProps) {
	return props as Required<StorybookProps>;
}

function StorybookCreate(setprops: StorybookProps) {
	const props = setProps(setprops as Required<StorybookProps>);
	const theme = useTheme();

	const children = useMemo(() => {
		return props.Node.Children.map((child, index) => {
			//We could also check the type, but I preffer this way
			if ("Children" in child) {
				return <Folder Node={child} Order={index}></Folder>;
			} else {
				return <Story Node={child} Order={index}></Story>;
			}
		});
	}, [props.Node.Children]);

	return (
		<ChildrenHolder
			Order={props.Order}
			Name={props.Node.Name}
			Sprite={"BookIcon"}
			SpriteColor={theme.Nodes.Normal.Book}
			Children={children}
		></ChildrenHolder>
	);
}
const Storybook = withHooks(StorybookCreate);

export = Storybook;
