local use_user_input = require "@contexts/app-render/use-user-input"
local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local image = require "@ui/styles/image"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"
local badge = require "./badge"

type MeasureToolProps = {
	--- absolute position and size of the overlay the tool draws in, absolute positions are
	--- turned into offsets inside it by subtracting its position
	view: Reactive<actions.GuiShape>,
}

-- the dashed line textures, one dash per 10 pixels. Each one is tiled along the direction its
-- line runs in, and stretched over the single pixel the line is thick
local LINE_TEXTURES = {
	horizontal = "rbxassetid://13895861348",
	vertical = "rbxassetid://13895889245",
}
local DASH = 10
local THICKNESS = 1

-- the label with the measured size, past the bottom right corner of the area. It is light
-- enough that its text is the dark one
local BADGE_COLOR = Color3.fromRGB(255, 206, 147)
local BADGE_TEXT_COLOR = Color3.fromRGB(0, 0, 0)
local BADGE_GAP = 7

type Axis = "horizontal" | "vertical"

local function input_position(input: InputObject): Vector2
	return Vector2.new(input.Position.X, input.Position.Y)
end

--- One edge of the measured area: a dashed line, one pixel thick, tiled along its own axis
local function line(props: { axis: Axis, anchor: Vector2, position: UDim2 })
	local vertical = props.axis == "vertical"

	return image {
		Name = props.axis,
		Image = LINE_TEXTURES[props.axis],
		ScaleType = Enum.ScaleType.Tile,
		TileSize = if vertical then UDim2.new(1, 0, 0, DASH) else UDim2.new(0, DASH, 1, 0),
		Size = if vertical then UDim2.new(0, THICKNESS, 1, 0) else UDim2.new(1, 0, 0, THICKNESS),
		AnchorPoint = props.anchor,
		Position = props.position,
		-- a faint solid line under the dashes, so the edge still reads over a busy story
		BackgroundTransparency = 0.5,
		BackgroundColor3 = Color3.new(0, 0, 0),
	}
end

--- Measure tool: dragging over the story draws the area the drag covers, with its size in
--- pixels at the bottom right. It takes the mouse from the story while it is enabled, so a
--- drag measures instead of pressing whatever is under it
local function measure_tool(props: MeasureToolProps)
	local user_input = use_user_input()

	--- absolute position the drag started at, nil while nothing is being measured
	local origin = vide.source(nil :: Vector2?)
	--- absolute position of the mouse, only followed while measuring
	local mouse = vide.source(Vector2.zero)

	--- the dragged area, normalized: a drag going up or left measures the same as one going
	--- down or right
	local function area(): (Vector2, Vector2)
		local start = origin() or mouse()
		local current = mouse()

		local min = Vector2.new(math.min(start.X, current.X), math.min(start.Y, current.Y))
		local size = Vector2.new(math.abs(current.X - start.X), math.abs(current.Y - start.Y))
		return min, size
	end

	local function on_input_began(input: InputObject)
		if input.UserInputType ~= Enum.UserInputType.MouseButton1 then
			return
		end

		local position = input_position(input)
		mouse(position)
		origin(position)
	end

	-- the drag follows the app wide inputs, the mouse can leave the story while measuring
	videx.connect(user_input.input_changed, function(input: InputObject)
		if origin() and input.UserInputType == Enum.UserInputType.MouseMovement then
			mouse(input_position(input))
		end
	end)
	videx.connect(user_input.input_ended, function(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			origin(nil)
		end
	end)

	local overlay = div {
		Name = "measure_tool",
		-- takes the inputs of the story, a drag over it measures and nothing else
		Active = true,

		vide.action(function(listener: Frame)
			videx.connect(listener.InputBegan, on_input_began)
		end),

		div {
			Name = "area",
			Visible = function()
				return origin() ~= nil
			end,
			Position = function()
				local min = area()
				local offset = min - props.view().position
				return UDim2.fromOffset(offset.X, offset.Y)
			end,
			Size = function()
				local _, size = area()
				return UDim2.fromOffset(size.X, size.Y)
			end,

			line { axis = "horizontal", anchor = Vector2.new(0, 0), position = UDim2.fromScale(0, 0) },
			line { axis = "horizontal", anchor = Vector2.new(0, 1), position = UDim2.fromScale(0, 1) },
			line { axis = "vertical", anchor = Vector2.new(0, 0), position = UDim2.fromScale(0, 0) },
			line { axis = "vertical", anchor = Vector2.new(1, 0), position = UDim2.fromScale(1, 0) },

			badge {
				Name = "size",
				AnchorPoint = Vector2.new(0, 1),
				Position = UDim2.new(1, BADGE_GAP, 1, -BADGE_GAP),
				color = BADGE_COLOR,
				text_color = BADGE_TEXT_COLOR,
				text = function()
					local _, size = area()
					return `{math.floor(size.X)} x {math.floor(size.Y)}`
				end,
			},
		},
	}

	-- vide only unparents what it stops rendering, the overlay has to be destroyed here
	vide.cleanup(overlay)

	return overlay
end

return measure_tool
