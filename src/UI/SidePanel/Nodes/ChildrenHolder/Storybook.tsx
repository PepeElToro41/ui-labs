import React, { useMemo } from "@rbxts/react";
import ChildrenHolder from ".";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Story from "../Story";
import Folder from "./Folder";

interface StorybookProps {
	Node: StorybookNode;
	Order: number;
}

function Storybook(props: StorybookProps) {
	const theme = useTheme();

	const children = useMemo(() => {
		return props.Node.Children.map((child, index) => {
			//We could also check the type, but I prefer this way
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
			SpriteColor={theme.Normal.Book}
			Children={children}
		></ChildrenHolder>
	);
}

export default Storybook;
