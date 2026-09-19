local vide = require "@pkg/vide"
local control_rendering = require "@ui/main-panel/control-rendering"
local columns = require "@ui/main-panel/control-rendering/columns"
local div = require "@ui/styles/div"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"

type ControlsTabProps = {
	preview: Reactive<ecs.Entity?>,
}

--- The controls table of the selected preview, rebuilt when the selection moves
local function controls_tab(props: ControlsTabProps)
	-- outlives the tables, the column width is kept from one story to the next
	local table_columns = columns.create()

	return div {
		Name = "controls",

		videx.single(props.preview :: Source<ecs.Entity?>, function(entity)
			local rendered = control_rendering {
				entity = entity :: ecs.Entity,
				columns = table_columns,
			}
			-- the table of the previous selection is only unparented
			vide.cleanup(rendered)
			return rendered
		end),
	}
end

return controls_tab
