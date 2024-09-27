import React, { useMemo } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Story from "../Story";
import ChildrenHolder from ".";

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
				return <Folder Node={child} Order={index} />;
			} else {
				return <Story Node={child} Order={index} />;
			}
		});
	}, [props.Node.Children]);

	return (
		<ChildrenHolder
			Name={props.Node.Instance}
			Order={props.Order}
			IsChild={true}
			Sprite={"FolderIcon"}
			SpriteColor={theme.Normal.FolderIcon}
			Children={children}
		></ChildrenHolder>
	);
}

export default Folder;
