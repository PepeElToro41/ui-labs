local Selection = game:GetService "Selection"

local IMAGES = require "@constants/images"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_holders = require "@hooks/use-holders"
local use_tools = require "@hooks/use-tools"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local actions = require "@utils/vide/actions"
local ecs = require "@vendor/ecs"
local toolbar_button = require "./toolbar-button"

type ToolbarContentProps = {
	--- the selected preview, the buttons act on it
	preview: Reactive<ecs.Entity?>,
	--- absolute size of the area the stories render in, the buttons zoom around its center
	view_size: Reactive<Vector2>,
	--- whether the toolbar is hovered
	hovered: Reactive<boolean>,
	--- absolute size of the button list, the holder expands to it
	size_output: Source<Vector2>,
}

-- scale multiplier of one button press
local ZOOM_STEP = 1.125

-- the atlas icons are drawn with more padding around them than the standalone ones
local ATLAS_SCALE = 1.2

-- the icons that are frames of the same sprite sheet
local ICONS = {
	viewport = { offset = Vector2.new(192, 0), size = Vector2.new(64, 64) },
	select = { offset = Vector2.new(192, 64), size = Vector2.new(64, 64) },
	measure = { offset = Vector2.new(128, 256), size = Vector2.new(64, 64) },
	select_elements = { offset = Vector2.new(128, 320), size = Vector2.new(64, 64) },
	outlines = { offset = Vector2.new(320, 0), size = Vector2.new(64, 64) },
}

--- The button list of the toolbar
local function toolbar_content(props: ToolbarContentProps)
	local world = use_world()
	local scale = use_component(props.preview :: Reactive<ecs.Entity>, c.preview_scale)
	local holders = use_holders(props.preview :: Reactive<ecs.Entity>)
	local holder = use_component(props.preview :: Reactive<ecs.Entity>, c.preview_holder)
	local tools = use_tools(props.preview :: Reactive<ecs.Entity>)

	local function reload()
		local preview = props.preview()
		if preview then
			previews.reload(world, preview)
		end
	end

	local function toggle_viewport()
		local preview = props.preview()
		if preview then
			previews.toggle_holder(world, preview, "viewport")
		end
	end

	--- selects the frame the story is mounted in, so it can be inspected in the explorer
	local function select_holder()
		local frame = holder()
		if frame then
			Selection:Set { frame }
		end
	end

	local function toggle_tool(tool: c.ToolType)
		local preview = props.preview()
		if preview then
			previews.toggle_tool(world, preview, tool)
		end
	end

	--- the tools are drawn over the editor slot, they have nothing to draw over a story that
	--- is being shown somewhere else
	local function away()
		return holders.active() ~= "editor"
	end

	local function zoom(factor: number)
		local preview = props.preview()
		if preview then
			previews.zoom(world, preview, (scale() or 1) * factor, props.view_size() / 2)
		end
	end

	return div {
		Name = "content",
		Size = UDim2.new(1, 0, 0, 0),
		AutomaticSize = Enum.AutomaticSize.Y,

		padding { paddingy = 2, paddingx = 6 },
		top_list { gap = 4, HorizontalAlignment = Enum.HorizontalAlignment.Center },

		toolbar_button {
			name = "reload",
			icon = IMAGES.reload,
			order = 1,
			hint = "Reload",
			toolbar_hovered = props.hovered,
			activated = reload,
		},
		toolbar_button {
			name = "zoom_in",
			icon = IMAGES.zoom_in,
			order = 2,
			hint = "Zoom In",
			toolbar_hovered = props.hovered,
			disabled = function()
				return (scale() or 1) >= previews.MAX_SCALE
			end,
			activated = function()
				zoom(ZOOM_STEP)
			end,
		},
		toolbar_button {
			name = "zoom_out",
			icon = IMAGES.zoom_out,
			order = 3,
			hint = "Zoom Out",
			toolbar_hovered = props.hovered,
			disabled = function()
				return (scale() or 1) <= previews.MIN_SCALE
			end,
			activated = function()
				zoom(1 / ZOOM_STEP)
			end,
		},
		toolbar_button {
			name = "viewport",
			icon = IMAGES.icon_atlas,
			icon_rect = ICONS.viewport,
			scale = ATLAS_SCALE,
			order = 4,
			hint = function()
				return if holders.viewport() then "Hide from Viewport" else "Show in Viewport"
			end,
			toolbar_hovered = props.hovered,
			active = holders.viewport,
			activated = toggle_viewport,
		},
		toolbar_button {
			name = "select",
			icon = IMAGES.icon_atlas,
			icon_rect = ICONS.select,
			scale = ATLAS_SCALE,
			order = 5,
			hint = "Select Holder",
			toolbar_hovered = props.hovered,
			disabled = function()
				return not holder()
			end,
			activated = select_holder,
		},
		toolbar_button {
			name = "measure",
			icon = IMAGES.icon_atlas,
			icon_rect = ICONS.measure,
			scale = ATLAS_SCALE,
			order = 6,
			hint = "Measure Tool",
			toolbar_hovered = props.hovered,
			active = tools.measure,
			disabled = away,
			activated = function()
				toggle_tool "measure"
			end,
		},
		toolbar_button {
			name = "select_elements",
			icon = IMAGES.icon_atlas,
			icon_rect = ICONS.select_elements,
			scale = ATLAS_SCALE,
			order = 7,
			hint = "Select Elements",
			toolbar_hovered = props.hovered,
			active = tools.select,
			disabled = away,
			activated = function()
				toggle_tool "select"
			end,
		},
		toolbar_button {
			name = "outlines",
			icon = IMAGES.icon_atlas,
			icon_rect = ICONS.outlines,
			scale = ATLAS_SCALE,
			order = 8,
			hint = "Show Outlines",
			toolbar_hovered = props.hovered,
			active = tools.outlines,
			disabled = away,
			activated = function()
				toggle_tool "outlines"
			end,
		},

		actions.absolute_size(props.size_output),
	}
end

return toolbar_content
