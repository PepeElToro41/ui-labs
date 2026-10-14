local use_component = require "@hooks/use-component"
local vide = require "@pkg/vide"
local c = require "@src/components"
local div = require "@ui/styles/div"
local types = require "./types"

--- Editor holder: a frame in the slot the story panel keeps for the preview. It carries the
--- zoom and the position of the story, which is why they only ever apply in the editor: a
--- story sent to the viewport or to a widget is shown there at its own size
local function editor_holder(props: types.HolderProps)
	local scale = use_component(props.entity, c.preview_scale)
	local offset = use_component(props.entity, c.preview_offset)

	local view = div {
		Name = "editor",
		Position = function()
			local pixels = offset() or Vector2.zero
			return UDim2.fromOffset(pixels.X, pixels.Y)
		end,

		vide.create "UIScale" {
			Name = "preview_scale",
			Scale = function()
				return scale() or 1
			end,
		},

		Parent = props.slot,
	}

	props.target(view)

	vide.cleanup(function()
		props.target(nil)
		-- deferred, so the story is moved out before the frame it sits in goes away
		task.defer(function()
			view:Destroy()
		end)
	end)
end

return editor_holder :: types.Holder
