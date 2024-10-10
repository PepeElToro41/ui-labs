local Vide = require "@pkg/vide"
local Divisor = require "@ui/elements/divisor"

local GetTitleRenderers = require "./container-titles/title-mapping"

local useTheme = require("@contexts/theme").useTheme
local NodeIdentifierKey = require("../utils").NodeIdentifierKey
local array_keys = require("@utils/vide").array_keys
local Story = require "./story"
local useFilter = require("@ui/side-panel/filtering").useFilter
local useNodeName = require("../utils").useNodeName

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local TopList = require "@styles/list/top"
local Corner = require "@styles/corner"
local Detector = require "@styles/detector"
local Padding = require "@styles/padding"

type Source<T> = Vide.Source<T>

local switch = Vide.switch
local source = Vide.source
local show = Vide.show

type NodeRendererProps = {
	Node: Reactive<Node>,
}

type ChildrenRendererProps = {
	Container: Reactive<ContainerNode>,
}

function ChildrenRenderer(props: ChildrenRendererProps): Reactive<any>
	local children: Reactive<{ ChildrenNode }> = function()
		return props.Container().Children
	end

	return array_keys(children, NodeIdentifierKey, function(node, key, index)
		local nodeType = function()
			return node().Type
		end

		return switch(nodeType) {
			Story = function()
				return Story { Node = node :: Reactive<StoryNode>, LayoutOrder = index, IsChild = true }
			end,
			Folder = function()
				return NodeContainer { Node = node :: Reactive<FolderNode>, LayoutOrder = index, IsChild = true }
			end,
		}
	end)
end

type NodeContainerProps = {
	Node: Reactive<ContainerNode>,
	LayoutOrder: Reactive<number>,
	IsChild: boolean?,
}

function NodeContainer(props: NodeContainerProps)
	local theme = useTheme()
	local hovered = source(false)
	local expanded = source(false)
	local name = useNodeName(props.Node)
	local filter = useFilter()

	local nodeType = function()
		return props.Node().Type
	end
	local appliedExpanded = function()
		return expanded() or filter()
	end

	return Div {
		Name = name,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = props.LayoutOrder,

		TopList { Gap = 1 },
		Frame {
			Name = "Title",
			BackgroundColor3 = theme "Background3",
			BackgroundTransparency = function()
				return hovered() and 0 or 1
			end,
			Size = UDim2.new(1, 0, 0, 25),

			Corner { Radius = 8 },

			-- Title Display
			switch(nodeType)(GetTitleRenderers(props.Node, expanded, name)),

			Divisor {
				Visible = not not props.IsChild,
				Anchor = 0,
				Position = UDim2.new(0, -6, 0.5, 0),
				Size = UDim.new(0, 6),
				Direction = "X",
			},
			Detector {
				Hovered = hovered,
				MouseButton1Click = function()
					expanded(not expanded())
				end,
			},
		},
		Div {
			Name = "ChildrenHolder",
			ClipsDescendants = true,
			Size = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.Y,

			Divisor {
				Direction = "Y",
				Position = UDim2.new(0, 9, 0, 0),
				Size = UDim.new(1, -13),
				Anchor = 0,
			},
			show(appliedExpanded, function()
				return Div {
					Name = "Children",
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					TopList { Gap = 1 },
					Padding { Left = 16 },
					ChildrenRenderer {
						Container = props.Node,
					},
				}
			end),
		},
	}
end

return NodeContainer
