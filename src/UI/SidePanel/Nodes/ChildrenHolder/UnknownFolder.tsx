import React, { useMemo } from "@rbxts/react";
import ChildrenHolder from ".";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Story from "../Story";
import UnknownCover from "../UnknownCover";

interface UnknownFolderProps {
	Order: number;
	Node: UnknownNode;
}

function setProps(props: UnknownFolderProps) {
	return props as Required<UnknownFolderProps>;
}

function UnknownFolder(setprops: UnknownFolderProps) {
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
			SpriteColor={theme.Normal.FolderIcon}
			Children={children}
		>
			<UnknownCover />
		</ChildrenHolder>
	);
}

export default UnknownFolder;
