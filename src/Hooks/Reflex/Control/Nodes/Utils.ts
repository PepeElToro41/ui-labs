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
				Type: "Story",
				Name: RemoveExtension(child.Name, Configs.Extensions.Story),
				Module: child,
				Parent: parentNode,
			});
			storyList.remove(storyList.indexOf(child));
			found++;
		} else if (child.GetChildren().size() > 0) {
			const newFolder: FolderNode = {
				Type: "Folder",
				Instance: child,
				Storybook: bookBind,
				Parent: parentNode,
				Children: [],
			};
			const foundChildren = IterateRoots(storyList, child.GetChildren(), newFolder, bookBind);
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

export function GenerateStorybooks(storyList: ModuleScript[], storybooks: Storybooks) {
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
			mappedNode.Children.push({
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Module: module,
				Parent: mappedNode,
			});
		} else {
			const newNode: UnknownNode = {
				Type: "Unknown",
				Instance: module.Parent,
				Children: [],
			};
			newNode.Children.push({
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Module: module,
				Parent: newNode,
			});
			mappedFolders.set(module.Parent, newNode);
		}
	});

	mappedFolders.forEach((node) => {
		unknownList.push(node);
	});
	return unknownList;
}
