local vide = require "@pkg/vide"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local class_colors = require "./class-colors"

export type BadgeProps = vide.vFrame & {
	text: Derivable<string>?,
	color: Derivable<Color3>?,
	--- white by default, dark enough colors are what this is for
	text_color: Derivable<Color3>?,
}

local HEIGHT = 18
local TEXT_SIZE = 12
local CORNER_RADIUS = 5
local PADDING = 5
local TEXT_COLOR = Color3.new(1, 1, 1)

--- The small label the tools put next to what they point at: the name of an element, a size.
--- It grows with its text and keeps its height, so it is placed by its anchor point and never
--- by its size. Anything else passed in is applied to the badge frame, children included
local function badge(props: BadgeProps)
	local label = props.text
	local color = props.color
	local text_color = props.text_color

	props.text = nil
	props.color = nil
	props.text_color = nil

	return frame {
		Name = "badge",
		Size = UDim2.fromOffset(0, HEIGHT),
		AutomaticSize = Enum.AutomaticSize.X,
		BackgroundColor3 = function()
			return vide.read(color) or class_colors.default
		end,

		corner { radius = CORNER_RADIUS },
		padding { paddingx = PADDING },
		text {
			Name = "label",
			Text = label,
			TextColor3 = function()
				return vide.read(text_color) or TEXT_COLOR
			end,
			TextSize = TEXT_SIZE,
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromScale(0, 1),
		},

		props,
	}
end

return badge
