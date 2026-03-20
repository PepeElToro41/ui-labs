import React, { useMemo } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

import ChildrenHolder from ".";
import UnknownCover from "../UnknownCover";
import UnknownFolder from "./UnknownFolder";

interface UnknownNodeProps {
	UnknownNodes: UnknownNode[];
}

function UnknownNode(props: UnknownNodeProps) {
	const theme = useTheme();

	const children = useMemo(() => {
		return props.UnknownNodes.map((child, index) => {
			return <UnknownFolder Node={child} Order={index} />;
		});
	}, [props.UnknownNodes]);

	return (
		<ChildrenHolder
			Prefix="3"
			Name={"Unknown Stories"}
			Sprite={"UnknownIcon"}
			SpriteColor={theme.Text.Color}
			Children={children}
		>
			<UnknownCover />
		</ChildrenHolder>
	);
}

export default UnknownNode;
