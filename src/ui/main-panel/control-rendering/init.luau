local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local top_list = require "@ui/styles/list/top-list"
local scroller = require "@ui/styles/scroller"
local actions = require "@utils/vide/actions"
local ecs = require "@vendor/ecs"
local columns = require "@self/columns"
local control_group = require "@self/control-group"
local control_list = require "@self/control-list"
local header_actions = require "@self/header-actions"

type ControlRenderingProps = {
	--- the preview that owns the controls
	entity: ecs.Entity,
	--- pass one to share the column width with other tables, or to keep it across remounts
	columns: columns.Columns?,
}

--- The controls of a preview as a two column table: name, then the control
local function control_rendering(props: ControlRenderingProps)
	local theme = use_theme()
	local table_columns = props.columns or columns.create()

	local size = vide.source(Vector2.zero)
	vide.effect(function()
		table_columns.table_width(size().X)
	end)

	return div {
		Name = "control_rendering",
		ClipsDescendants = true,

		actions.absolute_size(size),
		div {
			Name = "table",

			top_list {},
			columns.header {
				columns = table_columns,
				actions = header_actions { entity = props.entity },
			},
			scroller {
				Name = "rows",
				ScrollBarImageColor3 = theme(themes.border),
				LayoutOrder = 2,

				flex_fill(),
				top_list {},
				control_list {
					parent = props.entity,
					columns = table_columns,
					group = function(entity, order)
						return control_group {
							entity = entity,
							order = order,
							columns = table_columns,
						}
					end,
				},
			},
		},
		columns.divider { columns = table_columns },
	}
end

return control_rendering
