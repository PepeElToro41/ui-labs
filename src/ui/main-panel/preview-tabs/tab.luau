local CONFIG = require "@constants/config"
local IMAGES = require "@constants/images"
local use_app_render = require "@contexts/app-render/use-app-render"
local use_popup = require "@contexts/app-render/use-popup"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_instance_name = require "@hooks/use-instance-name"
local use_spring = require "@hooks/use-spring"
local use_tag = require "@hooks/use-tag"
local vide = require "@pkg/vide"
local c = require "@src/components"
local module_search = require "@src/systems/module-search"
local previews = require "@src/systems/previews"
local themes = require "@themes"
local glow = require "@ui/elements/glow"
local measured_frame = require "@ui/holders/measured-frame"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local drag_detector = require "@ui/styles/drag-detector"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local ecs = require "@vendor/ecs"
local tab_layout = require "./layout"
local tab_dropdown = require "./tab-dropdown"

type PreviewTabProps = {
	entity: ecs.Entity,
	--- shared strip layout, the tab reports its width and reads its slot from it
	layout: tab_layout.TabLayout,
}

local STORY_SUFFIX = CONFIG.file_extensions.story
local GLOW_EXTENDS = Vector2.new(14, 14)
local DRAG_THRESHOLD = 4

local function preview_tab(props: PreviewTabProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity
	local layout = props.layout

	local hovered = vide.source(false)
	local close_hovered = vide.source(false)

	local popup = use_popup(entity)
	local app_render = use_app_render()

	local module = use_component(entity, c.module_script)
	local module_name = use_instance_name(module)
	local quick = use_tag(entity, c.quick_mounted)
	local selected = use_tag(entity, c.selected_preview)

	local dragging = function()
		return layout.dragging() == entity
	end

	local hover_alpha = vide.spring(function()
		return if hovered() and (layout.dragging() == nil or dragging()) then 1 else 0
	end, 0.2, 1)

	-- the measured width feeds the strip layout, which hands back the slot to sit in
	local width = layout.register(entity)
	local measured = vide.source(Vector2.zero)
	vide.effect(function()
		width(measured().X)
	end)

	-- the spring renders a frame behind the cursor, so the dragged tab reads raw_x directly
	local raw_x = vide.source(0)
	local x, x_spring = use_spring(vide.untrack(function()
		return layout.slot_x(entity)
	end))
	x_spring:configure { dampingRatio = 1, frequency = 5, precision = 0.25 }

	local settled = false
	vide.effect(function()
		local slot = layout.slot(entity)
		local goal = if slot then slot.x else tab_layout.PADDING_X
		if layout.dragging() == entity then
			return
		end
		if not settled then
			x_spring:setPosition(goal)
		end
		x_spring:setGoal(goal)
		if slot and slot.settled then
			settled = true
		end
	end)

	local function stop_drag()
		if layout.dragging() == entity then
			layout.dragging(nil)
		end
	end

	vide.effect(function()
		if app_render.popup() then
			hovered(false)
			close_hovered(false)
			stop_drag()
		end
	end)

	local press_x: number? = nil
	local grab = 0
	local moved = false

	local function on_drag_start(mouse: Vector2)
		press_x = mouse.X
		moved = false
		grab = layout.to_canvas_x(mouse.X) - x()
	end

	local function on_drag_continue(mouse: Vector2)
		if not press_x then
			return
		end
		if not moved then
			if math.abs(mouse.X - press_x) < DRAG_THRESHOLD then
				return
			end
			moved = true
			layout.dragging(entity)
		end
		if layout.dragging() ~= entity then
			-- cancelled by a popup, the press is ignored until released
			return
		end

		local tab_width = width()
		local target = layout.clamp_x(layout.to_canvas_x(mouse.X) - grab, tab_width)
		raw_x(target)
		-- glued to the cursor with no velocity, so the drop springs home from where it was let go
		x_spring:setPosition(target)
		x_spring:setGoal(target)
		x_spring:halt()

		local slot = layout.slot(entity)
		local index = layout.index_for_bounds(entity, target, target + tab_width)
		if slot and index ~= slot.index then
			previews.move(world, entity, index)
		end
	end

	local function on_drag_end()
		-- the detector swallows the button clicks, so a press released without dragging is the click
		local clicked = press_x ~= nil and not moved
		press_x = nil
		moved = false
		stop_drag()
		if clicked then
			previews.select(world, entity)
		end
	end

	local name = function()
		if not module() then
			return "(Deleted)"
		end
		return module_search.remove_extension(module_name(), STORY_SUFFIX)
	end

	local label = function()
		return (if quick() then "• " else "") .. name()
	end

	local text_color = function()
		return theme()[if selected() then themes.text_active1 else themes.text2]
	end

	local function on_closed()
		previews.unmount(world, entity)
	end

	-- MouseButton2Up is swallowed by the detector too, the outer frame still sees the raw input
	local function on_input_ended(input: InputObject)
		if input.UserInputType ~= Enum.UserInputType.MouseButton2 then
			return
		end
		local position = Vector2.new(input.Position.X, input.Position.Y)
		popup.open(function()
			return tab_dropdown {
				entity = entity,
				position = position,
				popup = popup,
			}
		end)
	end

	return measured_frame {
		outer_children = {
			glow {
				name = "hover_glow",
				extends = GLOW_EXTENDS,
				blur = 0.8,
				color = theme(themes.emphasis),
				transparency = derivers.lerp(hover_alpha, 1, 0),
			},
			click_detector {
				-- below the measured frame so the close button receives its own clicks
				ZIndex = 0,
				actions.hovered(hovered),

				drag_detector {
					DragStyle = Enum.UIDragDetectorDragStyle.Scriptable,
					DragAxis = Vector2.new(1, 0),
					DragStart = on_drag_start,
					DragContinue = on_drag_continue,
					DragEnd = on_drag_end,
				},
			},
		} :: Array<Instance>,
		measured = measured,
		outer_native = {
			Position = function()
				return UDim2.fromOffset(if dragging() then raw_x() else x(), 0)
			end,
			-- the dragged tab renders over the ones it passes
			ZIndex = derivers.boolean(dragging, 2, 1),
			InputEnded = on_input_ended,
		},
		native = {
			Name = name,
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromScale(0, 1),
			BackgroundTransparency = 0,
			BackgroundColor3 = function()
				return theme()[if selected() then themes.emphasis else themes.background3]
			end,

			corner {
				radius = 8,
			},
			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = derivers.lerp(hover_alpha, 0.8, 0.5),
				Color = function()
					return theme().border:Lerp(theme().emphasis, hover_alpha())
				end,
			},
			div {
				Name = "holder",
				AutomaticSize = Enum.AutomaticSize.X,
				Size = UDim2.fromScale(0, 1),

				padding {
					paddingx = 8,
				},
				left_list {
					VerticalAlignment = Enum.VerticalAlignment.Center,
					gap = 5,
				},
				text {
					Name = "label",
					Text = label,
					TextColor3 = text_color,
					TextXAlignment = Enum.TextXAlignment.Left,
					AutomaticSize = Enum.AutomaticSize.X,
					Size = UDim2.fromScale(0, 1),
					LayoutOrder = 1,
				},
				frame {
					Name = "close",
					Size = UDim2.fromOffset(17, 17),
					LayoutOrder = 2,
					BackgroundColor3 = function()
						return theme()[if selected() then themes.emphasis2 else themes.background5]
					end,
					BackgroundTransparency = derivers.boolean(close_hovered, 0.3, 1),

					corner {
						radius = 6,
					},
					image {
						Name = "icon",
						Image = IMAGES.close,
						ImageColor3 = text_color,
						ScaleType = Enum.ScaleType.Fit,
						Size = UDim2.fromOffset(13, 13),
						Position = UDim2.fromScale(0.5, 0.5),
						AnchorPoint = Vector2.new(0.5, 0.5),
					},
					click_detector {
						Activated = on_closed,
						actions.hovered(close_hovered),
					},
				},
			},
		},
	}
end

return preview_tab
