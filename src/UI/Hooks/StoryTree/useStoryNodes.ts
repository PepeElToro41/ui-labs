import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import { RemoveExtension } from "Utils/NodeUtils";
import { HasUILib } from "Utils/StoryUtils";
import useStoryBook from "./Searches/useStoryBook";
import useStoryFolder from "./Searches/useStoryFolder";
import useStorySearch from "./Searches/useStorySearch";

function GenerateFolders(nodes: MainNodes, storyFolders: StoryFolders, storyList: ModuleScript[]) {}
function GenerateBooks(nodes: MainNodes, storyBooks: StoryBooks, storyList: ModuleScript[], LibsInfo: UILibsPartial) {
	const setNodes = nodes;
	const setStoryList = storyList;
	const IterateChildren = (children: Instance[], currentParentNode: BookNode | BookFolderNode, bookBind: BookNode) => {
		let totalFound = 0;
		const insidePush: (BookStoryNode | BookFolderNode)[] = [];
		children.forEach((child) => {
			if (child.IsA("ModuleScript") && setStoryList.includes(child)) {
				//Pushing a story with BookNodeBinded
				//print("APPLYING WITH BOOKNODE", bookBind);
				insidePush.push({
					DisplayName: RemoveExtension(child, ".story"),
					BookNodeBinded: bookBind,
					Module: child,
				});
				setStoryList.remove(setStoryList.indexOf(child));
				totalFound++;
			} else if (child.GetChildren().size() > 0) {
				//Pushing a folder this folder extends BookFolderNode, so it has BookNodeBinded which gets passed down
				const newParentNode: BookFolderNode = {
					DisplayName: child.Name,
					BookNodeBinded: bookBind,
					InstanceBinded: child,
					Inside: [],
				};
				const foundAmount = IterateChildren(child.GetChildren(), newParentNode, bookBind);
				if (foundAmount > 0) {
					currentParentNode.Inside.push(newParentNode);
					totalFound++;
				}
			}
		});
		insidePush.forEach((newNode) => {
			currentParentNode.Inside.push(newNode);
		});
		return totalFound;
	};

	storyBooks.forEach((book, module) => {
		let UILibs = LibsInfo || {};
		//print("Iterating book", module.GetFullName());
		if (HasUILib(book)) {
			UILibs = {
				roact: book.roact ?? undefined,
				react: book.react ?? undefined,
				reactRoblox: book.reactRoblox ?? undefined,
			};
		}
		const newParentNode: BookNode = {
			DisplayName: book.name ?? RemoveExtension(module, Configs.Extensions.StoryBook),
			ModuleBookBinded: module,
			UILibs: UILibs,
			Inside: [],
		};
		if (book.groupRoots) {
			IterateChildren(book.storyRoots, newParentNode, newParentNode);
		} else {
			book.storyRoots.forEach((child) => {
				IterateChildren(child.GetChildren(), newParentNode, newParentNode);
			});
		}
		setNodes.push(newParentNode);
	});
}

function GenerateUnknown(nodes: MainNodes, storyList: ModuleScript[]) {
	const setNodes = nodes;
	const nodesMap = new Map<Instance, FolderNode>();
	storyList.forEach((module) => {
		if (!module.Parent) return;
		const moduleMapNode = nodesMap.get(module.Parent);
		if (moduleMapNode) {
			moduleMapNode.Inside.push({
				DisplayName: RemoveExtension(module, Configs.Extensions.Story),
				Module: module,
			});
		} else {
			const newParentNode: FolderNode = {
				DisplayName: module.Parent.Name,
				Inside: [],
				InstanceBinded: module.Parent,
				Unknown: true,
			};
			newParentNode.Inside.push({
				DisplayName: RemoveExtension(module, Configs.Extensions.Story),
				Module: module,
			});
			nodesMap.set(module.Parent, newParentNode);
		}
	});
	nodesMap.forEach((node) => {
		setNodes.push(node);
	});
}

function GenerateNodes(
	storyList: ModuleScript[],
	storyFolders: StoryFolders,
	storyBooks: StoryBooks | undefined,
	LibsInfo: UILibsPartial,
) {
	const newStoryNodes: MainNodes = [];
	const setStoryList = table.clone(storyList);
	GenerateFolders(newStoryNodes, storyFolders, setStoryList);
	if (storyBooks) GenerateBooks(newStoryNodes, storyBooks, setStoryList, LibsInfo);
	GenerateUnknown(newStoryNodes, setStoryList);
	return newStoryNodes;
}

export = (search: (keyof Services)[], LibsInfo: UILibsPartial | undefined) => {
	const [storyList] = useStorySearch(search);
	const [storyFolders] = useStoryFolder(search);
	const [storyBooks] = useStoryBook(search);
	const [storyNodes, setNodes] = useState<MainNodes>(() => {
		return GenerateNodes(storyList as ModuleScript[], storyFolders, undefined, LibsInfo ?? {});
	});

	useUpdateEffect(() => {
		if (!storyBooks) return;
		setNodes(GenerateNodes(storyList as ModuleScript[], storyFolders, storyBooks, LibsInfo ?? {}));
		print("UPDATING FOR CHANGE");
	}, [storyBooks, storyList, storyFolders]);

	return $tuple(storyNodes);
};
