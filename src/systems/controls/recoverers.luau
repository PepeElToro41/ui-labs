local types = require "./types"

type Control = types.Control
type Recoverer = types.Recoverer

--[[
	Per-type rules deciding whether the value a user set on the previous mount can be
	reused by the control the reloaded story now declares. Returns `(ok, value)`; a
	rejection makes the caller fall back to the control's default.
]]

local function clamp(control: Control, value: unknown): (boolean, unknown)
	if type(value) ~= "number" then
		return false, nil
	end
	return true, math.clamp(value, control.Min or -math.huge, control.Max or math.huge)
end

local function passthrough(_control: Control, _old: Control, value: unknown): (boolean, unknown)
	return true, value
end

local RECOVERERS: { [types.ControlType]: Recoverer } = {
	String = function(control, _, value): (boolean, unknown)
		if type(value) ~= "string" then
			return false, nil
		end
		local filtered: string = value
		if control.Filters then
			for _, filter in control.Filters do
				filtered = filter(filtered, value)
			end
		end
		return true, filtered
	end,

	Number = function(control, _, value)
		return clamp(control, value)
	end,

	Boolean = passthrough,
	Color3 = passthrough,
	RGBA = passthrough,

	-- recovered by position in the list
	Choose = function(control, old_control, value): (boolean, unknown)
		local index = table.find(old_control.List, value)
		if not index then
			return false, nil
		end
		local item = control.List[index]
		if item == nil then
			return false, nil
		end
		return true, item
	end,

	-- recovered by key in the map
	EnumList = function(control, old_control, value): (boolean, unknown)
		for key, item in old_control.List do
			if item == value then
				local new_item = control.List[key]
				if new_item == nil then
					return false, nil
				end
				return true, new_item
			end
		end
		return false, nil
	end,

	Slider = function(control, _, value)
		-- TODO: respect step snapping
		return clamp(control, value)
	end,

	Object = function(control, _, value): (boolean, unknown)
		if value == nil then
			return true, nil
		end
		if typeof(value) ~= "Instance" then
			return false, nil
		end
		local instance = value :: Instance
		if not instance:IsA(control.ClassName or "Instance") then
			return false, nil
		end
		if control.Predicator and not control.Predicator(instance) then
			return false, nil
		end
		return true, instance
	end,
}

return RECOVERERS
