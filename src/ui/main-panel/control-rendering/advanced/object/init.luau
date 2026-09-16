local vide = require "@pkg/vide"
local object_holder = require "@self/object-holder"
local selected_object = require "@self/selected-object"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local types = require "../types"

local function object_control(props: types.ControlProps<types.ObjectControl, Instance?>)
	local function assign(object: Instance)
		if object == props.value() then
			return
		end

		local predicator = props.control.Predicator
		if predicator and not predicator(object) then
			warn(`Instance: {object} did not pass the predicator`)
			return
		end

		props.apply(object)
	end

	local function clear()
		props.apply(nil)
	end

	-- unassign the instance when it gets removed from the datamodel
	vide.effect(function()
		local current = props.value()
		if not current then
			return
		end

		local connection = current:GetPropertyChangedSignal("Parent"):Connect(function()
			if current.Parent == nil then
				props.apply(nil)
			end
		end)
		vide.cleanup(function()
			connection:Disconnect()
		end)
	end)

	return div {
		Size = UDim2.new(1, 0, 0, 32),

		left_list {
			gap = 12,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		object_holder {
			object = props.value,
			clear = clear,
			order = 1,
		},
		selected_object {
			current = props.value,
			class_name = props.control.ClassName,
			assign = assign,
			order = 2,
		},
	}
end

return object_control
