import React, { useMemo } from "@rbxts/react";
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

function Folder(setprops: FolderProps) {
	const props = setProps(setprops);
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

export default Folder;
