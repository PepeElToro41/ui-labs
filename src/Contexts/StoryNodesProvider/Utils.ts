import Configs from "Constants/Configs";
import { RemoveExtension } from "Contexts/ModuleSearchProvider/Utils";

export function GenerateNodes(storyList: ModuleScript[], requiredStorybooks: Storybooks) {
	//* Important: This mutates the storyList array, so make sure you pass an array that can be mutated
	const lookup: ModuleLookup = new Map(); //lookup map for getting nodes from modulescripts
	const storybooks = GenerateStorybooks(storyList, requiredStorybooks, lookup);
	const unknown = GenerateUnknown(storyList, lookup);

	OrderFoldersFirst(storybooks);
	const nodes: RootNodes = {
		Storybooks: storybooks,
		Unknown: unknown,
	};
	return { nodes, lookup };
}

function OrderFoldersFirst(storybooks: StorybookNode[]) {
	storybooks.forEach((book) => {
		const ordered: ChildrenNode[] = [];
		book.Children.forEach((child) => {
			//folders pass
			if (child.Type === "Folder") ordered.push(child);
		});
		book.Children.forEach((child) => {
			//stories pass
			if (child.Type !== "Folder") ordered.push(child);
		});
		book.Children = ordered;
	});
}

function IterateRoots(
	storyList: ModuleScript[],
	children: Instance[],
	parentNode: ParentNode,
	bookBind: StorybookNode,
	lookup: ModuleLookup,
) {
	let found = 0;
	const storyNodesPush: StoryNode[] = [];
	children.forEach((child) => {
		if (child.IsA("ModuleScript") && storyList.includes(child)) {
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(child.Name, Configs.Extensions.Story),
				Identifier: child,
				Module: child,
				Parent: parentNode,
			};
			storyNodesPush.push(storyNode);
			storyList.remove(storyList.indexOf(child));
			lookup.set(child, storyNode);

			found++;
		} else if (child.GetChildren().size() > 0) {
			const newFolder: FolderNode = {
				Type: "Folder",
				Instance: child,
				Identifier: child,
				Storybook: bookBind,
				Parent: parentNode,
				Children: [],
			};
			const foundChildren = IterateRoots(storyList, child.GetChildren(), newFolder, bookBind, lookup);
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

export function GenerateStorybooks(storyList: ModuleScript[], storybooks: Storybooks, lookup: ModuleLookup) {
	const storybookList: StorybookNode[] = [];
	storybooks.forEach((book, bookModule) => {
		const newNode: StorybookNode = {
			Type: "Storybook",
			Name: book.name ?? RemoveExtension(bookModule.Name, Configs.Extensions.Storybook),
			Result: book,
			Identifier: bookModule,
			Module: bookModule,
			Children: [],
		};
		if (book.groupRoots) {
			IterateRoots(storyList, book.storyRoots, newNode, newNode, lookup);
		} else {
			book.storyRoots.forEach((child) => IterateRoots(storyList, child.GetChildren(), newNode, newNode, lookup));
		}
		storybookList.push(newNode);
	});

	return storybookList;
}

// TODO: Make subfolders
export function GenerateUnknown(storyList: ModuleScript[], lookup: ModuleLookup) {
	const unknownList: UnknownNode[] = [];
	const mappedFolders = new Map<Instance, UnknownNode>();
	storyList.forEach((module) => {
		if (!module.Parent) return;
		const mappedNode = mappedFolders.get(module.Parent);

		if (mappedNode) {
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Identifier: module,
				Module: module,
				Parent: mappedNode,
			};
			mappedNode.Children.push(storyNode);
			lookup.set(module, storyNode);
		} else {
			const newNode: UnknownNode = {
				Type: "Unknown",
				Instance: module.Parent,
				Identifier: module.Parent,
				Children: [],
			};
			const storyNode: StoryNode = {
				Type: "Story",
				Name: RemoveExtension(module.Name, Configs.Extensions.Story),
				Identifier: module,
				Module: module,
				Parent: newNode,
			};
			newNode.Children.push(storyNode);
			mappedFolders.set(module.Parent, newNode);
			lookup.set(module, storyNode);
		}
	});
	mappedFolders.forEach((node) => {
		unknownList.push(node);
	});
	return unknownList;
}
