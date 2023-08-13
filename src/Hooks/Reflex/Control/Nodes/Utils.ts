import Configs from "Plugin/Configs";
import { RemoveExtension } from "../ModuleList/Utils";

export function GenerateNodes(storyList: ModuleScript[], requiredStorybooks: Storybooks) {
	const storybooks = GenerateStorybooks(storyList, requiredStorybooks);
	const unknown = GenerateUnknown(storyList);

	return { storybooks, unknown };
}

function IterateRoots(storyList: ModuleScript[], children: Instance[], parentNode: FolderNode | StorybookNode, bookBind: StorybookNode) {
	let found = 0;
	const storyNodesPush: StoryNode[] = [];
	children.forEach((child) => {
		if (child.IsA("ModuleScript") && storyList.includes(child)) {
			storyNodesPush.push({
				type: "Story",
				name: "",
				module: child,
				parent: parentNode,
			});
			storyList.remove(storyList.indexOf(child));
			found++;
		} else if (child.GetChildren().size() > 0) {
			const newFolder: FolderNode = {
				type: "Folder",
				instance: child,
				storybook: bookBind,
				parent: parentNode,
				children: [],
			};
			const foundChildren = IterateRoots(storyList, child.GetChildren(), newFolder, bookBind);
			if (foundChildren <= 0) return;
			parentNode.children.push(newFolder);
			found++;
		}
	});
	storyNodesPush.forEach((node) => {
		parentNode.children.push(node);
	});
	return found;
}

export function GenerateStorybooks(storyList: ModuleScript[], storybooks: Storybooks) {
	const storybookList: StorybookNode[] = [];

	storybooks.forEach((book, bookModule) => {
		const newNode: StorybookNode = {
			type: "Storybook",
			name: book.name ?? RemoveExtension(bookModule.Name, Configs.Extensions.Storybook),
			module: bookModule,
			children: [],
		};
		if (book.groupRoots) {
			IterateRoots(storyList, book.storyRoots, newNode, newNode);
		} else {
			book.storyRoots.forEach((child) => IterateRoots(storyList, child.GetChildren(), newNode, newNode));
		}
		storybookList.push(newNode);
	});

	return storybookList;
}

export function GenerateUnknown(storylist: ModuleScript[]) {
	const unknownList: UnknownNode[] = [];
	const mappedFolders = new Map<Instance, UnknownNode>();

	storylist.forEach((module) => {
		if (!module.Parent) return;
		const mappedNode = mappedFolders.get(module.Parent);

		if (mappedNode) {
			mappedNode.children.push({
				type: "Story",
				name: RemoveExtension(module.Name, Configs.Extensions.Story),
				module: module,
				parent: mappedNode,
			});
		} else {
			const newNode: UnknownNode = {
				type: "Unknown",
				instance: module.Parent,
				children: [],
			};
			newNode.children.push({
				type: "Story",
				name: RemoveExtension(module.Name, Configs.Extensions.Story),
				module: module,
				parent: newNode,
			});
			mappedFolders.set(module.Parent, newNode);
		}
	});

	mappedFolders.forEach((node) => {
		unknownList.push(node);
	});
	return unknownList;
}
