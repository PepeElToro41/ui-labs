local vide = require "@pkg/vide"
local picker_slider = require "@self/picker-slider"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local rounder = require "@ui/styles/rounder"
local derivers = require "@utils/vide/derivers"

type ColorComparatorProps = {
	start_color: Color3,
	color: Reactive<Color3>,
}

local function color_comparator(props: ColorComparatorProps)
	return div {
		Name = "color_comparator",
		Size = UDim2.fromOffset(26, 26),
		rounder(),

		vide.create "UIStroke" {
			Name = "shadow",
			Thickness = 2,
			Color = Color3.fromRGB(20, 20, 20),
			Transparency = 0.7,
		},
		div {
			Name = "top_half",
			Size = UDim2.fromScale(1, 0.5),
			ClipsDescendants = true,

			frame {
				Size = UDim2.fromScale(1, 2),
				BackgroundColor3 = props.start_color,
				rounder(),
			},
		},
		div {
			Name = "bottom_half",
			Size = UDim2.fromScale(1, 0.5),
			Position = UDim2.fromScale(0, 1),
			AnchorPoint = Vector2.new(0, 1),
			ClipsDescendants = true,

			frame {
				Size = UDim2.fromScale(1, 2),
				Position = UDim2.fromScale(0, 1),
				AnchorPoint = Vector2.new(0, 1),
				BackgroundColor3 = props.color,

				rounder(),
			},
		},
	}
end

type ColorControlProps = {
	start_color: Color3,
	color: Reactive<Color3>,

	alpha: Reactive<number>,
	use_alpha: boolean,

	get_coords: Reactive<Vector3>,
	update_coords: (Vector3) -> (),
	apply_coords: ((Vector3) -> ())?,
}

local HUE_MASK = Vector3.new(0, 1, 1)

local function color_controls(props: ColorControlProps)
	return div {
		Size = derivers.boolean(props.use_alpha, UDim2.new(1, 0, 0, 30), UDim2.new(1, 0, 0, 26)),

		left_list {
			gap = 14,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		padding {
			right = 8,
		},
		color_comparator {
			start_color = props.start_color,
			color = props.color,
		},
		div {
			Name = "sliders",

			flex_fill(),
			top_list {
				gap = 6,
				VerticalAlignment = Enum.VerticalAlignment.Center,
				HorizontalAlignment = Enum.HorizontalAlignment.Center,
			},
			picker_slider {
				name = "hue_bar",

				get_percentage = function()
					return props.get_coords().X
				end,
				handle_color = function()
					local hue = Color3.fromHSV(props.get_coords().X, 1, 1)
					return hue
				end,
				update_percentage = function(hue)
					local new_coords = props.get_coords() * HUE_MASK + Vector3.new(hue, 0, 0)
					props.update_coords(new_coords)
				end,
				apply_percentage = props.apply_coords and function(hue)
					local new_coords = props.get_coords() * HUE_MASK + Vector3.new(hue, 0, 0)
					props.update_coords(new_coords)
				end,
				background_render = function()
					return image {
						Name = "gradient",
						Image = "rbxassetid://14010941769",
						AnchorPoint = Vector2.new(0, 0.5),
						Position = UDim2.fromScale(0, 0.5),
						Size = UDim2.new(1, 0, 0, 9),

						rounder(),
					}
				end,
			},
			-- TODO: add alpha slider
		},
	}
end

return color_controls
