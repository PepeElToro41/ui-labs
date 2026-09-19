local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local utils = require "./utils"

vide.strict = false

local controls = {
	text = "hello",
	enabled = true,
	amount = ui_labs.Slider(5, 0, 10, 1),
}

-- both tabs show, the panel opens on the summary
return ui_labs.CreateVideStory({
	vide = vide,
	summary = "A story with a <b>summary</b> and controls, the action panel shows both tabs.",
	controls = controls,
}, function(props)
	return utils.value_list {
		title = "summary and controls",
		values = {
			{ name = "text", value = props.controls.text },
			{ name = "enabled", value = props.controls.enabled },
			{ name = "amount", value = props.controls.amount },
		},
	}
end)
