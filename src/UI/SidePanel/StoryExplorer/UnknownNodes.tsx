import { derive } from "@rbxts/vide";
import { MapArrayIndexes } from "Utils/Vide";

interface UnknownNodesProps {
	Nodes: () => UnknownNode[];
}

function UnknownNodes(props: UnknownNodesProps) {
	const indexedNodes = derive(() => {
		return MapArrayIndexes(props.Nodes(), "Instance");
	});
}

export default UnknownNodes;
