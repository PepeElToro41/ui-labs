local RunService = game:GetService "RunService"
local ui_labs = require "@pkg/ui-labs"
local UserInputService = ui_labs.Environment.UserInput

local pebble = require(script.Parent.Parent.Parent.Parent.pebble)
local vide = require(script.Parent.Parent.Parent.Parent.vide)

local create = vide.create
local source = vide.source
local cleanup = vide.cleanup

type props = {
	visible: boolean | () -> boolean,
	transparency: number? | () -> number,
	[number]: any,
}

return function(props: props)
	local mouse_location = source(Vector2.zero)

	cleanup(RunService.PreRender:Connect(function()
		mouse_location(UserInputService:GetMouseLocation())
	end))

	return create "ScreenGui" {
		Name = "Mouse Hover",
		IgnoreGuiInset = true,
		DisplayOrder = 1e9,
		Enabled = props.visible,

		create "Frame" {
			Position = function()
				return UDim2.fromOffset(mouse_location().X + 24, mouse_location().Y + 24)
			end,
			Size = UDim2.fromOffset(400, 0),
			AutomaticSize = Enum.AutomaticSize.XY,
			BackgroundColor3 = pebble.theme.bg[0],
			BackgroundTransparency = props.transparency or 0.5,

			pebble.padding {},

			create "UICorner" {
				CornerRadius = UDim.new(0, 8),
			},

			create "UIStroke" {
				Color = pebble.theme.bg[-10],
				Thickness = 2,
				Transparency = 0.8,
			},

			unpack(props),
		},
	}
end
