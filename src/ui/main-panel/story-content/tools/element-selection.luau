local RunService = game:GetService "RunService"
local Selection = game:GetService "Selection"

local use_user_input = require "@contexts/app-render/use-user-input"
local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"
local hit_test = require "./hit-test"
local marker = require "./marker"

type ElementSelectionProps = {
	--- the frame the story is mounted in, the elements are looked for under it
	root: Reactive<Frame?>,
	--- absolute position and size of the overlay the tool draws in, absolute positions are
	--- turned into offsets inside it by subtracting its position
	view: Reactive<actions.GuiShape>,
}

--- Element selection: marks the element the mouse is over and selects it in Studio when it is
--- clicked, so it can be inspected in the explorer and the properties panel.
---
--- A widget never reports what the mouse is over, so the story is walked and tested against
--- the mouse by hand (see `hit-test`). That leaves every element the mouse is over, in draw
--- order: the first of them is the one on top, which is the one this marks and selects.
local function element_selection(props: ElementSelectionProps)
	local user_input = use_user_input()

	--- every element under the mouse, the one on top first. Kept around for what reads deeper
	--- into it than the element on top
	local hits: { hit_test.Hit } = {}
	--- the marked element, only written when another one is marked: what reads it (its name,
	--- its class) does not change while it stays the same element
	local element = vide.source(nil :: GuiObject?)
	--- where it is drawn, measured again every frame
	local shape = vide.source(nil :: marker.Shape?)

	--- the marker follows the story while it is drawn, the story can move under a mouse that
	--- is not moving at all
	local function refresh()
		local root = props.root()
		hits = if root then hit_test.guis_at(root, user_input.mouse_position()) else {}

		local top = hits[1]
		if not top then
			element(nil)
			shape(nil)
			return
		end

		element(top.gui)
		shape {
			window = top.window,
			size = top.gui.AbsoluteSize,
		}
	end

	local function select_marked()
		local top = hits[1]
		if top then
			Selection:Set { top.gui }
		end
	end

	videx.connect(RunService.RenderStepped, refresh)

	local overlay = div {
		Name = "element_selection",
		-- takes the inputs of the story, a click selects the element under it and nothing else
		Active = true,

		vide.action(function(listener: Frame)
			videx.connect(listener.InputBegan, function(input: InputObject)
				if input.UserInputType == Enum.UserInputType.MouseButton1 then
					select_marked()
				end
			end)
		end),

		marker {
			element = element,
			shape = shape,
			view = props.view,
		},
	}

	-- vide only unparents what it stops rendering, the overlay has to be destroyed here
	vide.cleanup(overlay)

	return overlay
end

return element_selection
