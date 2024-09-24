import Vide from "@rbxts/vide";
import { Derived } from "Utils/Vide";
import { Storybook } from "./Nodes/ChildrenHolders/Storybook";
import { array_keys } from "Utils/Vide/ControlFlow";

interface StorybookNodesProps {
	Nodes: Derived<StorybookNode[]>;
}

function StorybookNodes(props: StorybookNodesProps) {
	return array_keys(props.Nodes, "Identifier", (node, key, index) => {
		return <Storybook Storybook={node} LayoutOrder={index} />;
	});
}

export default StorybookNodes;
