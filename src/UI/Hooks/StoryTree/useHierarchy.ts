import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { HttpService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import { EncodePath, GetUID } from "Utils/NodeUtils";
import { Copy } from "Utils/TableUtil";

function GenerateHierarchy(nodes: FolderNode[], bindingType: BindTypes) {
	const hierarchy: HierarchyFolder[] = [];
	const Iterate = (folderNode: FolderNode, currentFolder?: HierarchyFolder) => {
		if (folderNode.Unknown === true) {
			return;
		}
		const hierarchyFolder: HierarchyFolder = {
			DisplayName: folderNode.DisplayName,
			Inside: [],
		};
		folderNode.Inside.forEach((node) => {
			if ("Inside" in node) {
				Iterate(node, hierarchyFolder);
			} else {
				let Path: ReferencePath | undefined, UID: string | undefined;
				if (bindingType === "Path" || bindingType === "Dual") {
					Path = EncodePath(node.Module);
				}
				if (bindingType === "UID" || bindingType === "Dual") {
					UID = GetUID(node.Module);
				} else {
					node.Module.SetAttribute("UID", undefined);
				}
				if (Path || UID) {
					hierarchyFolder.Inside.push({
						DisplayName: node.DisplayName,
						ReferencePath: Path,
						UID: UID,
					});
				}
			}
		});
		if (currentFolder) {
			currentFolder.Inside.push(hierarchyFolder);
		} else {
			hierarchy.push(hierarchyFolder);
		}
	};

	nodes.forEach((node) => {
		Iterate(node);
	});
	return hierarchy;
}

export = (
	defaultHierarchy: PluginHierarchy, //default hierarachy to set (probably plugin:GetSetting() unless it's a story)
	setHierarchyPlugin: (hierarchy: PluginHierarchy) => void, //function to set hierarchy to the plugin
	bindingType: BindTypes,
) => {
	const [hierarchy, setHierarchy] = useState<PluginHierarchy>(defaultHierarchy);
	const RecalculateHierarchy = useCallback((nodes: FolderNode[]) => {
		const newHierarchy = GenerateHierarchy(nodes, bindingType);
		setHierarchy(newHierarchy);
	}, []);
	const getHierarchy = () => {
		return Copy(hierarchy) as PluginHierarchy;
	};
	useEffect(() => {
		setHierarchyPlugin(hierarchy as PluginHierarchy);
	}, [hierarchy]);
	return $tuple(getHierarchy, RecalculateHierarchy, setHierarchy);
};
