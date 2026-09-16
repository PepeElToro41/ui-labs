local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local use_component = require "@hooks/use-component"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local ecs = require "@vendor/ecs"

type StoryNodeProps = {
	entity: ecs.Entity,
	is_child: boolean?,
}

local function story_node(props: StoryNodeProps)
	local theme = use_theme()
	local entity = props.entity

	local hovered = vide.source(false)
	local node_name = use_component(entity, c.node_name)
	local order = use_component(entity, c.node_order)

	local name = function()
		return node_name() or ""
	end

	local function on_clicked()
		-- TODO: open the story preview
	end

	return div {
		Name = name,
		Size = UDim2.new(1, 0, 0, 27),
		LayoutOrder = function()
			return order() or 0
		end,

		div {
			Name = "title",

			padding {
				left = 13,
				right = 5,
			},
			frame {
				Name = "display",
				BackgroundColor3 = theme(themes.background3),
				BackgroundTransparency = derivers.boolean(hovered, 0, 1),

				padding {
					left = 8,
					right = 7,
				},
				corner {
					radius = 10,
				},
				div {
					left_list {
						VerticalAlignment = Enum.VerticalAlignment.Center,
						gap = 6,
					},
					image {
						Name = "icon",
						Image = IMAGES.story,
						ImageColor3 = theme(themes.story),
						Size = UDim2.fromOffset(13, 13),
					},
					text {
						Name = "name",
						Size = UDim2.new(1, -35, 1, 0),
						TextXAlignment = Enum.TextXAlignment.Left,
						ClipsDescendants = true,
						Text = name,
					},
				},
			},
		},
		divisor {
			direction = "X",
			visible = not not props.is_child,
			anchor = 0,
			position = UDim2.new(0, -6, 0.5, 0),
			size = UDim.new(0, 6),
		},
		image {
			Name = "dot",
			Image = IMAGES.dot,
			ImageColor3 = theme(themes.text1),
			ImageTransparency = 0.8,
			Size = UDim2.fromOffset(6, 6),
			Position = UDim2.new(0, 6, 0.5, 0),
			AnchorPoint = Vector2.new(0, 0.5),
		},
		click_detector {
			Activated = on_clicked,
			actions.hovered(hovered),
		},
	}
end

return story_node
