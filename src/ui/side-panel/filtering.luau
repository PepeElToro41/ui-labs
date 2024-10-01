local Vide = require "@pkg/vide"
local Sift = require "@pkg/sift"

local Dictionary = Sift.Dictionary

function FilterNodes(nodes: RootNodes, filter: string)
	local filtered: RootNodes = { Storybooks = {}, Unknown = {} }

	for _, storybookNode in pairs(nodes.Storybooks) do
		local filteredChildren = FilterChildren(storybookNode.Children, filter)
		if #filteredChildren <= 0 then continue end

		local newNode = Dictionary.set(storybookNode, "Children", filteredChildren)
		table.insert(filtered.Storybooks, newNode :: any)
	end
	for _, unknownNode in pairs(nodes.Unknown) do
		local filteredChildren = FilterChildren(unknownNode.Children, filter)
		if #filteredChildren <= 0 then continue end

		local newNode = Dictionary.set(unknownNode, "Children", filteredChildren)
		table.insert(filtered.Unknown, newNode :: any)
	end

	return filtered
end

function FilterChildren(children: { ChildrenNode }, filter: string)
	local filtered: { ChildrenNode } = {}

	for _, child in pairs(children) do
		if child["Children"] ~= nil then
			local filteredChildren = FilterChildren(child["Children"], filter)
			if #filteredChildren <= 0 then continue end

			local newChild = Dictionary.set(child, "Children", filteredChildren)
			table.insert(filtered, newChild :: any)
		else
			local match = (child :: StoryNode).Name:lower():match(filter:lower())
			if not match then continue end
			table.insert(filtered, child)
		end
	end
	return filtered
end

--[[ ---------------------------- CONTEXT PROVIDING --------------------------- ]]

local FilterContext: Vide.Context<Reactive<string?>> = Vide.create_context()

function useFilter()
	return FilterContext.consume()
end

return table.freeze {
	FilterNodes = FilterNodes,
	FilterContext = FilterContext,
	useFilter = useFilter,
}
