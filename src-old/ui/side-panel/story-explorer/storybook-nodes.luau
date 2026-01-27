local NodeIdentifierKey = require("./utils").NodeIdentifierKey
local NodeContainer = require "./nodes/container"

local array_keys = require("@utils/vide").array_keys

type StorybookNodesProps = {
	Nodes: Reactive<{ StorybookNode }>,
}

function StorybookNodes(props: StorybookNodesProps)
	return array_keys(props.Nodes, NodeIdentifierKey, function(node, key, index)
		return NodeContainer { Node = node, LayoutOrder = index, IsChild = false }
	end)
end

return StorybookNodes
