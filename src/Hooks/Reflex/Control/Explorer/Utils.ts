import Configs from "Plugin/Configs";
import { RemoveExtension } from "../ModuleList/Utils";

export function GenerateNodes(storyList: ModuleScript[], requiredStorybooks: Storybooks) {
	//* Important: This mutates the array, so make sure you pass a storyList that can be mutated
	const nodemap: NodeMap = new Map();
	const storybooks = GenerateStorybooks(storyList, requiredStorybooks, nodemap);
	const unknown = GenerateUnknown(storyList, nodemap);
	const nodes = { storybooks, unknown };
	return { nodes, nodemap };
}

function IterateRoots(storyList: ModuleScript[], children: Instance[], parentNode: ParentNode, bookBind: StorybookNode, nodemap: NodeMap) {
	let found = 0;
	const storyNodesPush: StoryNode[] = [];
	children.forEach((child) => {
		if (child.IsA("ModuleScript") && storyList.includes(child)) {
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(child.Name, Configs.Extensions.Story),
				Module: child,
				Parent: parentNode,
			};
			storyNodesPush.push(storyNode);
			storyList.remove(storyList.indexOf(child));
			nodemap.set(child, storyNode);

			found++;
		} else if (child.GetChildren().size() > 0) {
			const newFolder: FolderNode = {
				Type: "Folder",
				Instance: child,
				Storybook: bookBind,
				Parent: parentNode,
				Children: [],
			};
			const foundChildren = IterateRoots(storyList, child.GetChildren(), newFolder, bookBind, nodemap);
			if (foundChildren <= 0) return;
			parentNode.Children.push(newFolder);
			found++;
		}
	});
	storyNodesPush.forEach((node) => {
		parentNode.Children.push(node);
	});
	return found;
}

export function GenerateStorybooks(storyList: ModuleScript[], storybooks: Storybooks, nodemap: NodeMap) {
	const storybookList: StorybookNode[] = [];

	storybooks.forEach((book, bookModule) => {
		const newNode: StorybookNode = {
			Type: "Storybook",
			Name: book.name ?? RemoveExtension(bookModule.Name, Configs.Extensions.Storybook),
			Result: book,
			Module: bookModule,
			Children: [],
		};
		if (book.groupRoots) {
			IterateRoots(storyList, book.storyRoots, newNode, newNode, nodemap);
		} else {
			book.storyRoots.forEach((child) => IterateRoots(storyList, child.GetChildren(), newNode, newNode, nodemap));
		}
		storybookList.push(newNode);
	});

	return storybookList;
}

export function GenerateUnknown(storylist: ModuleScript[], nodemap: NodeMap) {
	const unknownList: UnknownNode[] = [];
	const mappedFolders = new Map<Instance, UnknownNode>();

	storylist.forEach((module) => {
		if (!module.Parent) return;
		const mappedNode = mappedFolders.get(module.Parent);

		if (mappedNode) {
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Module: module,
				Parent: mappedNode,
			};
			mappedNode.Children.push(storyNode);
			nodemap.set(module, storyNode);
		} else {
			const newNode: UnknownNode = {
				Type: "Unknown",
				Instance: module.Parent,
				Children: [],
			};
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Module: module,
				Parent: newNode,
			};
			newNode.Children.push(storyNode);
			mappedFolders.set(module.Parent, newNode);
			nodemap.set(module, storyNode);
		}
	});

	mappedFolders.forEach((node) => {
		unknownList.push(node);
	});
	return unknownList;
}
