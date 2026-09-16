local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local text = require "@ui/styles/text"
local videx = require "@utils/vide/videx"
local icon_button = require "./icon-button"
local instance_label = require "./instance-label"

local Selection = game:GetService "Selection"

local ASSIGN_ICON = "rbxassetid://16456383286"

type SelectedObjectProps = {
	-- the instance currently assigned to the control
	current: Reactive<Instance?>,
	-- class the selected instance must be to be assignable
	class_name: string,
	-- called with the selected instance when the assign button is clicked
	assign: (object: Instance) -> (),

	order: number?,
}

type SelectionState = "empty" | "single" | "many"

-- displays the current studio selection with a button to assign it
local function selected_object(props: SelectedObjectProps)
	local theme = use_theme()
	local selection = vide.source(Selection:Get())

	videx.connect(Selection.SelectionChanged, function()
		selection(Selection:Get())
	end)

	local state = vide.derive(function(): SelectionState
		local amount = #selection()
		if amount == 0 then
			return "empty"
		elseif amount == 1 then
			return "single"
		else
			return "many"
		end
	end)
	local selected = function(): Instance?
		return selection()[1]
	end

	local assign_disabled = function()
		local object = selected()
		if state() ~= "single" or not object then
			return true
		end
		if object == props.current() then
			return true
		end
		return not object:IsA(props.class_name)
	end

	local function assign_selected()
		local object = selected()
		if not object then
			return
		end
		props.assign(object)
	end

	local function grayed_text(name: string, label: Reactive<string>)
		return text {
			Name = name,
			Text = label,
			TextSize = 13,
			TextColor3 = theme(themes.text3),
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		}
	end

	return div {
		Name = "selected_object",
		Size = UDim2.fromScale(0, 1),
		AutomaticSize = Enum.AutomaticSize.X,
		LayoutOrder = props.order,

		left_list {
			gap = 8,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		text {
			Name = "selected_label",
			Text = "Selected:",
			TextSize = 13,
			TextColor3 = theme(themes.text2),
			LayoutOrder = 1,
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
		div {
			Name = "selection",
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			LayoutOrder = 2,

			vide.switch(state) {
				empty = function()
					return grayed_text("no_selection", function()
						return "Nothing"
					end)
				end,
				many = function()
					return grayed_text("many_selected", function()
						return `{#selection()} items`
					end)
				end,
				single = function()
					return instance_label {
						instance = selected,
						icon_size = 15,
						min_width = 60,
						max_width = 200,
					}
				end,
			},
		},
		divisor {
			direction = "Y",
			size = UDim.new(1, -10),
			order = 3,
		},
		icon_button {
			name = "assign_button",
			icon = ASSIGN_ICON,
			size = 24,
			icon_size = 16,
			order = 4,
			disabled = assign_disabled,
			activated = assign_selected,
		},
	}
end

return selected_object
