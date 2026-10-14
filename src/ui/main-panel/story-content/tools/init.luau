local use_component = require "@hooks/use-component"
local use_holders = require "@hooks/use-holders"
local use_tools = require "@hooks/use-tools"
local c = require "@src/components"
local div = require "@ui/styles/div"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"
local element_selection = require "@self/element-selection"
local measure_tool = require "@self/measure-tool"
local outline_marker = require "@self/outline-marker"

--[[
	Story tools: the overlays drawn over the story of the selected preview.

	- `measure`  dragging over the story measures the area the drag covers
	- `select`   marks the element the mouse is over and selects it in Studio when clicked
	- `outlines` outlines every element of the story

	Each one is enabled on the preview itself (`previews.toggle_tool`, the toolbar buttons),
	and they are all drawn in one overlay frame that covers the story area. The tools are
	given absolute positions by the story and the position of the overlay to subtract from
	them, so that nothing has to care about the zoom and the offset of the preview: those are
	applied to the frame the story is mounted in, not to the overlay.

	That is also why the tools only run while the story is in the editor: a story shown in the
	viewport or in a widget of its own is drawn in another gui entirely, where none of the
	positions measured here mean anything.
]]

type StoryToolsProps = {
	--- the selected preview, the tools act on the story it has mounted
	preview: Reactive<ecs.Entity?>,
}

local function story_tools(props: StoryToolsProps)
	local preview = props.preview :: Reactive<ecs.Entity>

	local root = use_component(preview, c.preview_holder)
	local holders = use_holders(preview)
	local tools = use_tools(preview)

	--- absolute position and size of the overlay: the tools draw at absolute positions as
	--- offsets inside it, and keep what they draw within it
	local view = actions.shape_source()

	local function enabled(tool: Reactive<boolean>): Reactive<boolean>
		return function()
			if not root() or holders.active() ~= "editor" then
				return false
			end
			return tool()
		end
	end

	return div {
		Name = "story_tools",
		-- over the story holders
		ZIndex = 2,
		-- an element at the edge of the story is outlined up to the edge of the panel, not
		-- over whatever is next to it
		ClipsDescendants = true,

		actions.absolute_shape(view),

		-- the outlines go under the tools that are interacted with
		videx.show(enabled(tools.outlines), function()
			return outline_marker { root = root, view = view }
		end),
		videx.show(enabled(tools.select), function()
			return element_selection { root = root, view = view }
		end),
		videx.show(enabled(tools.measure), function()
			return measure_tool { view = view }
		end),
	}
end

return story_tools
