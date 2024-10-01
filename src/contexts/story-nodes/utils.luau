local Array = require("@pkg/collections").Array
local RemoveExtension = require("@contexts/module-search/utils").RemoveExtension
local CONFIGS = require "@constants/configs"

function GenerateNodes(storyList: { ModuleScript }, storybooks: Storybooks)
	storyList = table.clone(storyList) -- making it mutable

	local lookup: ModuleLookup = {}
	local storybookNodes = GenerateStorybookNodes(storyList, storybooks, lookup)
	local unknownNodes = GenerateUnknownNodes(storyList, lookup)

	OrderFoldersFirst(storybookNodes)

	local nodes: RootNodes = {
		Storybooks = storybookNodes,
		Unknown = unknownNodes,
	}

	return {
		Nodes = nodes,
		Lookup = lookup,
	}
end

function IterateRoots(
	storyList: { ModuleScript },
	children: { Instance },
	parentNode: ParentNode,
	storybookBind: StorybookNode,
	lookup: ModuleLookup
)
	local found = 0
	local storyNodes: { StoryNode } = {}

	for _, child in ipairs(children) do
		if child:IsA "ModuleScript" and Array.includes(storyList, child) then
			local node: StoryNode = {
				Type = "Story",
				Name = RemoveExtension(child.Name, CONFIGS.Extensions.Story),
				Module = child,
				Parent = parentNode,
			}
			table.insert(storyNodes, node)
			table.remove(storyList, Array.indexOf(storyList, child))
			lookup[child] = node

			found += 1
		elseif #child:GetChildren() > 0 then
			local folderNode: FolderNode = {
				Type = "Folder",
				Instance = child,
				Storybook = storybookBind,
				Parent = parentNode,
				Children = {},
			}
			local foundChildren = IterateRoots(storyList, child:GetChildren(), folderNode, storybookBind, lookup)
			if foundChildren <= 0 then continue end
			table.insert(parentNode.Children, folderNode)

			found += 1
		end
	end
	for _, node in ipairs(storyNodes) do
		table.insert(parentNode.Children, node)
	end

	return found
end

function GenerateStorybookNodes(storyList: { ModuleScript }, storybooks: Storybooks, lookup: ModuleLookup)
	local storybookNodes: { StorybookNode } = {}
	for module, storybook in storybooks do
		local node: StorybookNode = {
			Type = "Storybook",
			Name = storybook.name or RemoveExtension(module.Name, CONFIGS.Extensions.Storybook),
			Result = storybook,
			Module = module,
			Children = {},
		}

		if storybook.groupRoots then
			IterateRoots(storyList, storybook.storyRoots, node, node, lookup)
		else
			for _, child in ipairs(storybook.storyRoots) do
				IterateRoots(storyList, child:GetChildren(), node, node, lookup)
			end
		end
		table.insert(storybookNodes, node)
	end

	return storybookNodes
end

-- TODO: make subfolders, hoarcekat style
function GenerateUnknownNodes(storyList: { ModuleScript }, lookup: ModuleLookup)
	local unknownNodes: { UnknownNode } = {}
	local mappedFolders: Map<Instance, UnknownNode> = {}
	for _, module in pairs(storyList) do
		if not module.Parent then continue end

		local mappedNode = mappedFolders[module.Parent]

		if mappedNode then
			local node: StoryNode = {
				Type = "Story",
				Name = RemoveExtension(module.Name, CONFIGS.Extensions.Story),
				Identifier = module,
				Module = module,
				Parent = mappedNode,
			}
			table.insert(mappedNode.Children, node)
			lookup[module] = node
		else
			local unknownNode: UnknownNode = {
				Type = "Unknown",
				Instance = module.Parent,
				Children = {},
			}
			local node: StoryNode = {
				Type = "Story",
				Name = RemoveExtension(module.Name, CONFIGS.Extensions.Story),
				Identifier = module,
				Module = module,
				Parent = unknownNode,
			}
			table.insert(unknownNode.Children, node)
			mappedFolders[module.Parent] = unknownNode
			lookup[module] = node
		end
	end

	for _, node in pairs(mappedFolders) do
		table.insert(unknownNodes, node)
	end

	return unknownNodes
end

function OrderFoldersFirst(storybookNodes: { StorybookNode })
	for i, node in pairs(storybookNodes) do
		local ordered: { ChildrenNode } = {}

		for _, child in pairs(node.Children) do
			-- folders pass
			if child.Type == "Folder" then table.insert(ordered, child) end
		end
		for _, child in pairs(node.Children) do
			-- stories pass
			if child.Type == "Story" then table.insert(ordered, child) end
		end
		node.Children = ordered
	end
end

function GetNodeIdentifierKey(node: Node): string
	if node.Type == "Story" then
		return "Module"
	elseif node.Type == "Storybook" then
		return "Module"
	else
		return "Instance"
	end
end

function GetNodeIdentifier(node: Node): Instance
	return node[GetNodeIdentifierKey(node)]
end

return table.freeze {
	GenerateNodes = GenerateNodes,
	GetNodeIdentifierKey = GetNodeIdentifierKey,
	GetNodeIdentifier = GetNodeIdentifier,
}
