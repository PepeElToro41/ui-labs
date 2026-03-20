import React, { useMemo } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

import ChildrenHolder from ".";
import Story from "../Story";

interface FolderProps {
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
				return <Folder Node={child} />;
			} else {
				return <Story Node={child} />;
			}
		});
	}, [props.Node.Children]);

	return (
		<ChildrenHolder
			Prefix="1"
			Name={props.Node.Instance}
			IsChild={true}
			Sprite={"FolderIcon"}
			SpriteColor={theme.Normal.FolderIcon}
			Children={children}
		></ChildrenHolder>
	);
}

export default Folder;
