local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local utils = require "./utils"

vide.strict = false

-- one of every kind the renderers handle, plus a group and explicit ordering
local controls = {
	text = ui_labs.Ordered(ui_labs.String "hello", 1),
	count = ui_labs.Ordered(ui_labs.Number(3, 0, 20, 1), 2),
	enabled = ui_labs.Ordered(ui_labs.Boolean(true), 3),
	amount = ui_labs.Ordered(ui_labs.Slider(0.5, 0, 1), 4),
	color = ui_labs.Ordered(Color3.fromRGB(180, 133, 255), 5),
	choice = ui_labs.Ordered(ui_labs.Choose { "first", "second", "third" }, 6),
	size = ui_labs.ControlGroup {
		width = 120,
		height = 40,
	},
}

-- no summary: the summary tab is hidden and the panel opens on the controls
return ui_labs.CreateVideStory({
	vide = vide,
	controls = controls,
}, function(props)
	return utils.value_list {
		title = "controls only",
		values = {
			{ name = "text", value = props.controls.text },
			{ name = "count", value = props.controls.count },
			{ name = "enabled", value = props.controls.enabled },
			{ name = "amount", value = props.controls.amount },
			{ name = "color", value = props.controls.color },
			{ name = "choice", value = props.controls.choice },
			{ name = "size.width", value = props.controls.size.width },
			{ name = "size.height", value = props.controls.size.height },
		},
	}
end)
