import React, { useMemo } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

import ChildrenHolder from ".";
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
			//We could also check the type to be "Folder""
			if ("Children" in child) {
				return <Folder Node={child} Order={index} />;
			} else {
				return <Story Node={child} Order={index} />;
			}
		});
	}, [props.Node.Children]);

	return (
		<ChildrenHolder
			Order={props.Order}
			Name={props.Node.Name}
			Sprite={"BookIcon"}
			IsChild={false}
			SpriteColor={theme.Normal.Book}
			Children={children}
		></ChildrenHolder>
	);
}

export default Storybook;
