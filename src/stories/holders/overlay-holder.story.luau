local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local AppRender = require "@contexts/app-render"

local cleanup = Vide.cleanup
local show = Vide.show
local Frame = require "@base/frame"

local OverlayHolder = require "@ui/overlays/overlay-holder"

local story = UILabs.CreateVideStory({ vide = Vide }, function(props)
	local position = Vide.source((nil :: any) :: Vector2)

	cleanup(UILabs.Environment.InputListener.InputBegan:Connect(function(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			position(Vector2.new(input.Position.X, input.Position.Y))
		end
	end))

	return AppRender.AppRenderProvider {
		children = function()
			local anchor: Source<Frame> = Vide.source(nil :: any)

			return show(position, function(): any
				return {
					Frame {
						Name = "Anchor",
						BackgroundColor3 = Color3.fromRGB(255, 108, 108),
						Size = UDim2.fromOffset(200, 50),
						Position = function()
							local position = position() or Vector2.new(0, 0)
							return UDim2.fromOffset(position.X, position.Y)
						end,
						Vide.action(anchor),
					},
					OverlayHolder {
						HolderNative = {
							Size = UDim2.fromOffset(100, 100),
						},
						DominantAxis = Enum.DominantAxis.Height,
						AnchorPosition = anchor,
						AnchorSize = anchor,
						Padding = 5,
						Wrappeable = {
							Vector2.new(0, 2),
							Vector2.new(0, -1),
							Vector2.new(2, 0.5),
							Vector2.new(-1, 0.5),
						},
						Children = function(wrap: Vector2)
							return nil
						end,
					},
				}
			end)
		end,
	}
end)

return story
