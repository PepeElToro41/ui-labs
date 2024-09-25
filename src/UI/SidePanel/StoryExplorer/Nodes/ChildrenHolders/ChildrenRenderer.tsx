import { Derived } from "Utils/Vide";
import { array_keys } from "Utils/Vide/ControlFlow";

export interface NodeRendererProps {
	Node: Derived<any>;
	Index: Derived<number>;
	IsChild?: boolean;
}
export type NodeRenderer = (props: NodeRendererProps) => Vide.Node;

interface ChildrenRendererProps {
	Renderers: Record<string, NodeRenderer>;
	Container: Derived<ContainerNode>;
}

function ChildrenRenderer(props: ChildrenRendererProps) {
	return () => {
		const children = () => props.Container().Children;

		return array_keys(children, "Identifier", (node, key, index) => {
			const Renderer = props.Renderers[node().Type];

			return Renderer ? Renderer({ Node: node, Index: index, IsChild: true }) : () => undefined;
		});
	};
}

export default ChildrenRenderer;
