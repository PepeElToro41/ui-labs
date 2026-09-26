local use_modifier_keys = require "@contexts/app-render/use-modifier-keys"
local use_user_input = require "@contexts/app-render/use-user-input"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local div = require "@ui/styles/div"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"

type ViewListenerProps = {
	--- the selected preview, the one being moved and zoomed
	preview: Reactive<ecs.Entity?>,
}

type Drag = {
	preview: ecs.Entity,
	mouse_start: Vector2,
	offset_start: Vector2,
}

-- scale multiplier of one scroll wheel step
local ZOOM_STEP = 1.1

local function input_position(input: InputObject): Vector2
	return Vector2.new(input.Position.X, input.Position.Y)
end

--- Covers the story holders and moves / zooms the selected story while ctrl is held:
--- ctrl + drag changes its `preview_offset`, ctrl + scroll wheel its `preview_scale`.
local function view_listener(props: ViewListenerProps)
	local world = use_world()
	local user_input = use_user_input()
	local ctrl = use_modifier_keys().ctrl

	local drag: Drag? = nil

	local function on_input_began(input: InputObject)
		if input.UserInputType ~= Enum.UserInputType.MouseButton1 or not ctrl() then
			return
		end
		local preview = props.preview()
		if not preview then
			return
		end

		drag = {
			preview = preview,
			mouse_start = input_position(input),
			offset_start = world.get(preview, c.preview_offset) or Vector2.zero,
		}
	end

	local function on_scroll(frame: Frame, input: InputObject)
		if input.UserInputType ~= Enum.UserInputType.MouseWheel or not ctrl() then
			return
		end
		local preview = props.preview()
		if not preview then
			return
		end

		local scale = world.get(preview, c.preview_scale) or 1
		local pivot = input_position(input) - frame.AbsolutePosition
		previews.zoom(world, preview, scale * ZOOM_STEP ^ math.sign(input.Position.Z), pivot)
	end

	-- the drag follows the app wide inputs, the mouse can leave the story while dragging
	videx.connect(user_input.input_changed, function(input: InputObject)
		if drag and input.UserInputType == Enum.UserInputType.MouseMovement then
			local moved = input_position(input) - drag.mouse_start
			previews.set_offset(world, drag.preview, drag.offset_start + moved)
		end
	end)
	videx.connect(user_input.input_ended, function(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			drag = nil
		end
	end)

	-- a release outside the widget is never reported, letting go of ctrl also ends the drag
	vide.effect(function()
		local preview = props.preview()
		if not ctrl() or (drag and drag.preview ~= preview) then
			drag = nil
		end
	end)

	return div {
		Name = "view_listener",
		-- over the story holders
		ZIndex = 2,
		-- takes the inputs while ctrl is held, so the story does not react to them
		Active = ctrl,

		vide.action(function(frame: Frame)
			videx.connect(frame.InputBegan, on_input_began)
			videx.connect(frame.InputChanged, function(input: InputObject)
				on_scroll(frame, input)
			end)
		end),
	}
end

return view_listener
