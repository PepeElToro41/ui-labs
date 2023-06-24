import useStorySearch from "./useStorySearch";
import Configs from "Plugin/Configs";
import { DecodePath, GetLabelName, GetUID } from "Utils/NodeUtils";
import { Copy } from "Utils/TableUtil";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";

function FindBindedModule(bindInfo: HierarchyModuleBind, available: ModuleScript[]): ModuleScript | void {
	let parent: Instance | undefined = undefined;
	if (bindInfo.ReferencePath) {
		parent = DecodePath(bindInfo.ReferencePath);
	}
	for (let index = 0; index < available.size(); index++) {
		const module = available[index];
		if (parent && module.Parent === parent) {
			//The module was found with the path
			if (bindInfo.UID) {
				//The bindInfo can provide a UID, checking if it matches
				if (GetUID(module) === bindInfo.UID) {
					return module;
				}
			} else {
				//The bindInfo does not provide a UID, checking Name
				if (module.Name === bindInfo.ReferencePath!.ModuleName) {
					return module;
				}
			}
		} else {
			//The module was not found with path, checking by UID
			if (bindInfo.UID) {
				if (GetUID(module) === bindInfo.UID) {
					return module;
				}
			}
		}
	}
}
function GenerateNodes(storyList: ModuleScript[], hierarchy: PluginHierarchy) {
	const storiesUnknown = table.clone(storyList); //Saves all nodes that are not in the hierarchy
	const nodesList: FolderNode[] = [];
	const Iterate = (folder: HierarchyFolder, currentFolder?: FolderNode) => {
		const folderNode: FolderNode = {
			DisplayName: folder.DisplayName,
			Inside: [],
		};
		folder.Inside.forEach((member) => {
			if ("Inside" in member) {
				Iterate(member, folderNode);
			} else {
				const module = FindBindedModule(member, storiesUnknown);
				if (module) {
					folderNode.Inside.push({
						DisplayName: GetLabelName(module),
						Module: module,
					});
					storiesUnknown.remove(storiesUnknown.indexOf(module));
				}
			}
		});
		if (currentFolder) {
			currentFolder.Inside.push(folderNode);
		} else {
			nodesList.push(folderNode);
		}
	};
	hierarchy.forEach((folder) => {
		Iterate(folder);
	});
	//Creating unknown folder
	if (storiesUnknown.size() > 0) {
		nodesList.push({
			DisplayName: "Unknown",
			Unknown: true,
			Inside: storiesUnknown.map((module) => {
				return {
					DisplayName: GetLabelName(module),
					Module: module,
				};
			}),
		});
	}
	return nodesList;
}
function FixNodes(storyList: ModuleScript[], nodes: FolderNode[]) {
	const newStoryNodes: FolderNode[] = [];
	const storiesUnknown = table.clone(storyList); //Saves all nodes that are not in the hierarchy
	const Iterate = (folderNode: FolderNode, currentFolder?: FolderNode) => {
		if (folderNode.Unknown === true) {
			return;
		}
		const newFolderNode: FolderNode = {
			DisplayName: folderNode.DisplayName,
			Inside: [],
		};
		folderNode.Inside.forEach((nodeMember) => {
			if ("Inside" in nodeMember) {
				Iterate(nodeMember, newFolderNode);
			} else {
				const bindedModule = storyList.find((module) => {
					return module === nodeMember.Module;
				});
				if (!bindedModule) return;
				if (!game.IsAncestorOf(bindedModule)) return;
				storiesUnknown.remove(storiesUnknown.indexOf(bindedModule));
				newFolderNode.Inside.push({
					DisplayName: GetLabelName(bindedModule),
					Module: bindedModule,
				});
			}
		});
		if (currentFolder) {
			currentFolder.Inside.push(newFolderNode);
		} else {
			newStoryNodes.push(newFolderNode);
		}
	};
	nodes.forEach((node) => {
		Iterate(node);
	});
	if (storiesUnknown.size() > 0) {
		newStoryNodes.push({
			DisplayName: "Unknown",
			Unknown: true,
			Inside: storiesUnknown.map((module) => {
				return {
					DisplayName: GetLabelName(module),
					Module: module,
				};
			}),
		});
	}
	return newStoryNodes;
}

//This hook holds the story nodes (AKA the hierarchy that is shown in the explorer)
export = (
	storyList: ModuleScript[],
	getHierarchy: () => PluginHierarchy,
	recalculateHierarchy: (nodes: FolderNode[]) => void,
) => {
	const [storyNodes, setNodes] = useState<FolderNode[]>(() => {
		return GenerateNodes(storyList as ModuleScript[], getHierarchy());
	});
	const newFolder = useCallback((folderName: string, folderParent?: FolderNode) => {}, []);
	const RecalculateNodes = useCallback(() => {
		setNodes((oldNodes) => {
			const GeneratedNodes = FixNodes(storyList as ModuleScript[], oldNodes);
			return GeneratedNodes;
		});
	}, [storyList, setNodes]);
	useEffect(() => {
		RecalculateNodes();
	}, [storyList]);
	useEffect(() => {
		recalculateHierarchy(Copy(storyNodes as FolderNode[]));
	}, [storyNodes]);
	return $tuple(storyNodes, RecalculateNodes, newFolder);
};
