local IMAGES = require "@constants/images"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
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

--- The button list of the toolbar
local function toolbar_content(props: ToolbarContentProps)
	local world = use_world()
	local scale = use_component(props.preview :: Reactive<ecs.Entity>, c.preview_scale)

	local function reload()
		local preview = props.preview()
		if preview then
			previews.reload(world, preview)
		end
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

		actions.absolute_size(props.size_output),
	}
end

return toolbar_content
