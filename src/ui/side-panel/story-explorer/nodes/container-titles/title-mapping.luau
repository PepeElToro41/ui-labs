local TitleRenderer = require "./title-renderer"
local IMAGES = require "@constants/images"

local Image = require "@styles/image"
local useTheme = require("@contexts/theme").useTheme

type RendererProps = {
	Node: Reactive<ContainerNode>,
	Expanded: Reactive<boolean>,
	Name: Reactive<string>,
}

local TITLES_MAP: Map<string, (props: RendererProps) -> Instance> = {
	Storybook = function(props: RendererProps)
		local theme = useTheme()

		return TitleRenderer {
			Name = props.Name,
			Expanded = props.Expanded,
			Icon = Image {
				Size = UDim2.fromOffset(13, 13),
				Image = IMAGES.Storybook,
				ImageColor3 = theme "Storybook",
			},
		}
	end,
	Unknown = function(props: RendererProps)
		local theme = useTheme()

		return TitleRenderer {
			Name = props.Name,
			Expanded = props.Expanded,
			Icon = Image {
				Size = UDim2.fromOffset(13, 13),
				Image = IMAGES.Folder,
				ImageColor3 = theme "Folder",
			},
		}
	end,
	Folder = function(props: RendererProps)
		local theme = useTheme()

		return TitleRenderer {
			Name = props.Name,
			Expanded = props.Expanded,
			Icon = Image {
				Size = UDim2.fromOffset(13, 13),
				Image = IMAGES.Folder,
				ImageColor3 = theme "Folder",
			},
		}
	end,
}

function GetTitleRenderers(node: Reactive<ContainerNode>, expanded: Reactive<boolean>, name: Reactive<string>)
	local map: { [string]: () -> Instance } = {}

	for key, value in pairs(TITLES_MAP) do
		map[key] = function()
			return value { Node = node, Expanded = expanded, Name = name }
		end
	end
	return map
end

return GetTitleRenderers
