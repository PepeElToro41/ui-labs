export function FilterNodes(nodes: RootNodes, filter: string) {
	print("FILTERING WITH", filter);
	const filteredNodes: RootNodes = { storybooks: [], unknown: [] };

	nodes.storybooks.forEach((storybookNode) => {
		const filteredChildren = FilterChildren(storybookNode.children, filter);
		if (filteredChildren.size() <= 0) return;
		filteredNodes.storybooks.push({
			...storybookNode,
			children: filteredChildren,
		});
	});
	nodes.unknown.forEach((unknownNode) => {
		const filteredChildren = FilterChildren(unknownNode.children, filter);
		if (filteredChildren.size() <= 0) return;
		filteredNodes.unknown.push({
			...unknownNode,
			children: filteredChildren as StoryNode[],
		});
	});

	return filteredNodes;
}

export function FilterChildren(children: ChildrenNode[], filter: string) {
	const filtered: ChildrenNode[] = [];

	children.forEach((child) => {
		if ("children" in child) {
			const filteredChildren = FilterChildren(child.children, filter);
			if (filteredChildren.size() <= 0) return;
			filtered.push(child);
		} else {
			if (!child.name.lower().match(filter.lower())[0]) return;
			filtered.push(child);
		}
	});

	return filtered;
}
