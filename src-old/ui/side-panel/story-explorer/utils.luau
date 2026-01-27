local Vide = require "@pkg/vide"
local GetNodeIdentifierKey = require("@contexts/story-nodes/utils").GetNodeIdentifierKey

type Source<T> = Vide.Source<T>

local source = Vide.source
local effect = Vide.effect
local read = Vide.read
local cleanup = Vide.cleanup

function NodeIdentifierKey(node: Node)
	return GetNodeIdentifierKey(node)
end

function useNodeName(node: Derivable<Node>)
	local nameGetter: Reactive<string | Instance> = function()
		local readNode: Node = read(node)

		if readNode.Type == "Story" then
			return readNode.Name
		elseif readNode.Type == "Storybook" then
			return readNode.Name
		elseif readNode.Type == "Folder" then
			return readNode.Instance
		end
		return "---"
	end

	local name: Source<string> = source()

	effect(function()
		local getter = nameGetter()
		if type(getter) == "string" then
			name(getter)
			return
		end

		name(getter.Name)
		cleanup(getter:GetPropertyChangedSignal("Name"):Connect(function()
			name(getter.Name)
		end))
	end)

	return name
end

return table.freeze {
	NodeIdentifierKey = NodeIdentifierKey,
	useNodeName = useNodeName,
}
