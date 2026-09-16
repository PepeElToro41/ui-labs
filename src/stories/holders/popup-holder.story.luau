local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local popup_holder = require "@ui/holders/popup-holder"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local text = require "@ui/styles/text"

vide.strict = false

-- order matters: first place that fits entirely inside the canvas wins
local wrappable_places = {
	Vector2.new(0, 2), -- below, aligned to the left edge of the anchor
	Vector2.new(0, -1), -- above, aligned to the left edge of the anchor
	Vector2.new(2, 0), -- right, aligned to the top edge of the anchor
	Vector2.new(-1, 0), -- left, aligned to the top edge of the anchor
	Vector2.new(1, 2), -- below, aligned to the right edge of the anchor
	Vector2.new(1, -1), -- above, aligned to the right edge of the anchor
}

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	-- the anchor is draggable so the wrapping can be tested against every canvas edge
	local anchor = vide.create "TextButton" {
		Name = "anchor",
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.5),
		Size = UDim2.fromOffset(120, 32),
		BackgroundColor3 = Color3.fromRGB(60, 120, 220),
		BorderSizePixel = 0,
		Text = "drag me",
		TextColor3 = Color3.new(1, 1, 1),
		FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
		TextSize = 14,
		AutoButtonColor = false,

		corner { radius = 6 },
		vide.create "UIDragDetector" {},
	}

	local canvas = div {
		Name = "canvas",
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.5),
		Size = UDim2.new(1, -80, 1, -80),
		BackgroundTransparency = 0.95,

		vide.create "UIStroke" {
			Color = Color3.fromRGB(120, 120, 120),
			Thickness = 1,
		},
		anchor,
	}

	local popup = popup_holder {
		Name = "popup",
		canvas = canvas,
		dominant_axis = Enum.DominantAxis.Height,
		anchor_position = anchor,
		anchor_size = anchor,
		padding = 6,
		inner_padding = 8,
		scrollable = false,
		wrappable_places = wrappable_places,

		children = function()
			return nil
		end,

		native = {
			AutomaticSize = Enum.AutomaticSize.XY,
			Size = UDim2.fromOffset(0, 0),
			BackgroundTransparency = 0,
			BackgroundColor3 = Color3.fromRGB(40, 40, 40),

			corner { radius = 6 },
			vide.create "UIListLayout" {
				FillDirection = Enum.FillDirection.Vertical,
				Padding = UDim.new(0, 4),
			},
			vide.create "UIPadding" {
				PaddingLeft = UDim.new(0, 10),
				PaddingRight = UDim.new(0, 10),
				PaddingTop = UDim.new(0, 8),
				PaddingBottom = UDim.new(0, 8),
			},

			text {
				Text = "popup contents",
				TextColor3 = Color3.new(1, 1, 1),
				AutomaticSize = Enum.AutomaticSize.XY,
				Size = UDim2.fromOffset(0, 0),
			},
			text {
				Text = "wraps to the first place that fits",
				TextColor3 = Color3.fromRGB(180, 180, 180),
				TextSize = 12,
				AutomaticSize = Enum.AutomaticSize.XY,
				Size = UDim2.fromOffset(0, 0),
			},
			vide.create "Frame" {
				Size = UDim2.fromOffset(220, 120),
				BackgroundColor3 = Color3.fromRGB(80, 80, 80),
				BorderSizePixel = 0,
				corner { radius = 4 },
			},
		},
	}
	popup.Parent = canvas

	return canvas
end)
