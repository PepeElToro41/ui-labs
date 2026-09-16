local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_instance_name = require "@hooks/use-instance-name"
local use_query = require "@hooks/use-query"
local use_tag = require "@hooks/use-tag"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"
local container_title = require "./container-title"
local story_node = require "./story"

type ContainerNodeProps = {
	entity: ecs.Entity,
	is_child: boolean?,
}

local function container_node(props: ContainerNodeProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	local hovered = vide.source(false)
	local expanded = use_tag(entity, c.expanded)
	local order = use_component(entity, c.node_order)

	local is_storybook = use_tag(entity, c.storybook_node)
	local node_name = use_component(entity, c.node_name)
	local instance_name = use_instance_name(use_component(entity, c.node_instance))

	-- storybooks and the unknown root carry a name, folders follow their instance
	local name = function()
		return node_name() or instance_name()
	end

	local children = use_query(world.query():with(ecs.pair(ecs.ChildOf, entity)))

	local function toggle_expanded()
		if world.has(entity, c.expanded) then
			world.remove(entity, c.expanded)
		else
			world.add(entity, c.expanded)
		end
	end

	return div {
		Name = name,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = function()
			return order() or 0
		end,

		top_list {
			gap = 1,
		},
		frame {
			Name = "title",
			Size = UDim2.new(1, 0, 0, 27),
			BackgroundColor3 = theme(themes.background3),
			BackgroundTransparency = derivers.boolean(hovered, 0, 1),

			corner {
				radius = 8,
			},
			container_title {
				name = name,
				expanded = expanded,
				icon = function()
					return if is_storybook() then IMAGES.storybook else IMAGES.folder
				end,
				icon_color = function()
					local current = theme()
					return if is_storybook() then current.storybook else current.folder
				end,
			},
			divisor {
				visible = not not props.is_child,
				anchor = 0,
				position = UDim2.new(0, -6, 0.5, 0),
				size = UDim.new(0, 6),
				direction = "X",
			},
			click_detector {
				Activated = toggle_expanded,
				actions.hovered(hovered),
			},
		},
		div {
			Name = "children_holder",
			ClipsDescendants = true,
			Size = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.Y,

			divisor {
				direction = "Y",
				position = UDim2.new(0, 9, 0, 0),
				size = UDim.new(1, -13),
				anchor = 0,
			},
			videx.show(expanded, function()
				return div {
					Name = "children",
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					top_list {
						gap = 1,
					},
					padding {
						left = 16,
					},
					vide.values(children, function(child): Instance?
						if world.has(child, c.folder_node) then
							return container_node { entity = child, is_child = true }
						elseif world.has(child, c.story_node) then
							return story_node { entity = child, is_child = true }
						end
						return nil
					end) :: any,
				}
			end),
		},
	}
end

return container_node
