local vide = require "@pkg/vide"

--- Tracks the `Name` of an instance reactively
local function use_instance_name(instance: Derivable<Instance?>): Reactive<string>
	local output = vide.source ""

	vide.effect(function()
		local current = vide.read(instance) :: Instance?
		if not current then
			output ""
			return
		end

		output(current.Name)
		vide.cleanup(current:GetPropertyChangedSignal("Name"):Connect(function()
			output(current.Name)
		end))
	end)

	return output
end

return use_instance_name
