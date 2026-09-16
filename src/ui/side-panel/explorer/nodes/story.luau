local IMAGES = require "@constants/images"
local use_app_render = require "@contexts/app-render/use-app-render"
local use_popup = require "@contexts/app-render/use-popup"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local previews = require "@src/systems/previews"
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
local ecs = require "@vendor/ecs"
local use_visible_nodes = require "../use-visible-nodes"
local story_dropdown = require "./story-dropdown"

type StoryNodeProps = {
	entity: ecs.Entity,
	visible: use_visible_nodes.VisibleNodes,
	is_child: boolean?,
}

local function story_node(props: StoryNodeProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	local hovered = vide.source(false)
	-- owned by the node so the menu closes with it
	local popup = use_popup(entity)
	local app_render = use_app_render()

	-- the contents are not interactable while a popup is open, so MouseLeave never fires
	vide.effect(function()
		if app_render.popup() then
			hovered(false)
		end
	end)
	local node_name = use_component(entity, c.node_name)
	local order = use_component(entity, c.node_order)

	local name = function()
		return node_name() or ""
	end

	-- previews sit ChildOf their story node, so the node can count its own mounts
	local mounted = use_query(world.query():with(c.story_preview, ecs.pair(ecs.ChildOf, entity)))
	local quick_mounted = use_query(world.query():with(c.story_preview, c.quick_mounted, ecs.pair(ecs.ChildOf, entity)))

	local mount_amount = function()
		return #mounted()
	end
	-- the node is highlighted while the quick preview shows this story
	local is_quick = function()
		return #quick_mounted() > 0
	end

	local text_color = function()
		return theme()[if is_quick() then themes.text_active1 else themes.text1]
	end
	local amount_color = function()
		return theme()[if is_quick() then themes.text_active3 else themes.text3]
	end

	local shown = function()
		local visible = props.visible()
		return visible == nil or visible[entity] == true
	end

	-- a plain click swaps the quick preview to this story (or closes it when already shown)
	local function on_clicked()
		previews.quick_mount(world, entity)
	end

	-- right click opens the story menu at the cursor. Listens to the release: the press
	-- closes any open popup, which is what makes this node interactable again
	local function on_dropdown(x: number, y: number)
		popup.open(function()
			return story_dropdown {
				node = entity,
				position = Vector2.new(x, y),
				popup = popup,
			}
		end)
	end

	return div {
		Name = name,
		Size = UDim2.new(1, 0, 0, 27),
		Visible = shown,
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
				BackgroundColor3 = function()
					return theme()[if is_quick() then themes.emphasis else themes.background3]
				end,
				BackgroundTransparency = function()
					return if hovered() or is_quick() then 0 else 1
				end,

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
						ImageColor3 = function()
							return theme()[if is_quick() then themes.text_active1 else themes.story]
						end,
						Size = UDim2.fromOffset(13, 13),
					},
					text {
						Name = "name",
						Size = UDim2.new(1, -35, 1, 0),
						TextXAlignment = Enum.TextXAlignment.Left,
						ClipsDescendants = true,
						Text = name,
						TextColor3 = text_color,
					},
				},
				text {
					Name = "mount_amount",
					Position = UDim2.new(1, -3, 0.5, 0),
					AnchorPoint = Vector2.new(1, 0.5),
					Size = UDim2.new(0, 5, 1, 0),
					TextSize = 12,
					TextXAlignment = Enum.TextXAlignment.Right,
					Text = function()
						return tostring(mount_amount())
					end,
					TextColor3 = amount_color,
					Visible = function()
						return mount_amount() > 0
					end,
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
			MouseButton2Up = on_dropdown,
			actions.hovered(hovered),
		},
	}
end

return story_node
