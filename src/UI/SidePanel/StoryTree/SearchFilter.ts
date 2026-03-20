export function FilterNodes(nodes: RootNodes, filter: string) {
	const filteredNodes: RootNodes = { storybooks: [], unknown: [] };

	nodes.storybooks.forEach((storybookNode) => {
		const filteredChildren = FilterChildren(storybookNode.Children, filter);
		if (filteredChildren.size() <= 0) return;
		filteredNodes.storybooks.push({
			...storybookNode,
			Children: filteredChildren
		});
	});
	nodes.unknown.forEach((unknownNode) => {
		const filteredChildren = FilterChildren(unknownNode.Children, filter);
		if (filteredChildren.size() <= 0) return;
		filteredNodes.unknown.push({
			...unknownNode,
			Children: filteredChildren as StoryNode[]
		});
	});

	return filteredNodes;
}

export function FilterChildren(children: ChildrenNode[], filter: string) {
	const filtered: ChildrenNode[] = [];

	children.forEach((child) => {
		if ("Children" in child) {
			const filteredChildren = FilterChildren(child.Children, filter);
			if (filteredChildren.size() <= 0) return;
			filtered.push({
				...child,
				Children: filteredChildren
			});
		} else {
			const match = child.Name.lower().match(filter.lower())[0];
			if (match === undefined) return;
			filtered.push(child);
		}
	});

	return filtered;
}
