local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local shadow = require "@ui/elements/shadow"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local rounder = require "@ui/styles/rounder"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local ecs = require "@vendor/ecs"
local toolbar_content = require "@self/toolbar-content"

type ToolbarProps = {
	--- the selected preview, the buttons act on it
	preview: Reactive<ecs.Entity?>,
	--- absolute size of the area the stories render in, the zoom buttons zoom around its center
	view_size: Reactive<Vector2>,
}

local TOOLBAR_SIZE = 34
local START_SIZE = 28

--- Floats over the story as a small round button, hovering it expands the button list
local function toolbar(props: ToolbarProps)
	local theme = use_theme()
	local hovered = vide.source(false)
	local content_size = vide.source(Vector2.zero)
	local alpha = vide.spring(derivers.boolean(hovered, 1, 0), 0.25, 1)

	-- the previews system keeps a tab selected while any preview is mounted
	local visible = function()
		return props.preview() ~= nil
	end
	-- MouseLeave does not fire on a hidden frame, it would show up expanded again
	vide.effect(function()
		if not visible() then
			hovered(false)
		end
	end)

	local size = function()
		local expanded = UDim2.fromOffset(TOOLBAR_SIZE, content_size().Y)
		return UDim2.fromOffset(START_SIZE, START_SIZE):Lerp(expanded, alpha())
	end

	return div {
		Name = "toolbar",
		Position = UDim2.fromOffset(6, 4),
		Size = size,
		Visible = visible,
		-- over the story holders
		ZIndex = 2,

		actions.hovered(hovered),
		frame {
			Name = "holder",
			BackgroundColor3 = theme(themes.background3),
			ClipsDescendants = true,

			corner { radius = 10 },
			toolbar_content {
				preview = props.preview,
				view_size = props.view_size,
				hovered = hovered,
				size_output = content_size,
			},
		},
		-- hides the buttons while collapsed, it fades out as the toolbar expands
		frame {
			Name = "cover",
			-- equal ZIndex siblings have no reliable order
			ZIndex = 2,
			BackgroundColor3 = theme(themes.background3),
			BackgroundTransparency = alpha,

			rounder {},
		},
		div {
			Name = "collapsed_icon",
			ZIndex = 3,
			Size = UDim2.fromOffset(START_SIZE, START_SIZE),

			image {
				Name = "icon",
				Image = IMAGES.toolbar_layout,
				Size = UDim2.fromOffset(18, 18),
				Position = UDim2.fromScale(0.5, 0.5),
				AnchorPoint = Vector2.new(0.5, 0.5),
				ImageColor3 = theme(themes.text1),
				ImageTransparency = alpha,
			},
		},
		shadow {
			blur = 0.8,
			position = Vector2.zero,
			transparency = 0.3,
			extends = function()
				return Vector2.new(14, 14):Lerp(Vector2.new(16, 16), alpha())
			end,
		},
	}
end

return toolbar
