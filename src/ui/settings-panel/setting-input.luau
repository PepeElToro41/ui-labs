local boolean_input = require "@ui/components/inputs/boolean-input"
local number_input = require "@ui/components/inputs/number-input"
local string_input = require "@ui/components/inputs/string-input"
local div = require "@ui/styles/div"
local settings_config = require "./settings-config"

type SettingInputProps = {
	setting: settings_config.Setting,
	-- typed by the setting, the config keeps each value in line with its default
	value: Source<any>,
}

local INPUT_SIZE = Vector2.new(220, 28)

-- the inputs that size themselves stick to the right edge
local RIGHT_ALIGNED = {
	AnchorPoint = Vector2.new(1, 0.5),
	Position = UDim2.fromScale(1, 0.5),
}

--- Picks the generic input that edits the type of the setting
local function setting_input(props: SettingInputProps)
	local setting = props.setting
	local value = props.value

	local input
	if setting.type == "boolean" then
		input = boolean_input {
			value = value,
			apply = value,
			native = RIGHT_ALIGNED,
		}
	elseif setting.type == "number" then
		input = number_input {
			value = value,
			apply = value,
			min = setting.min,
			max = setting.max,
			step = setting.step,
			prefix = setting.unit,
			native = RIGHT_ALIGNED,
		}
	else
		input = string_input {
			value = value,
			apply = value,
			placeholder = setting.placeholder,
			-- a growing input would push the rest of the settings around
			multiline = false,
		}
	end

	return div {
		Name = "setting_input",
		AnchorPoint = Vector2.new(1, 0.5),
		Position = UDim2.fromScale(1, 0.5),
		Size = UDim2.fromOffset(INPUT_SIZE.X, INPUT_SIZE.Y),

		input,
	}
end

return setting_input
