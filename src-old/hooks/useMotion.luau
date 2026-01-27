local RunService = game:GetService "RunService"

local Vide = require "@pkg/vide"
local Ripple = require "@pkg/ripple"

local source = Vide.source
local cleanup = Vide.cleanup
local effect = Vide.effect
local read = Vide.read

function useMotion(init: number, active: Derivable<boolean>?)
	local value = source(init)
	active = if active == nil then true else active
	local motion = Ripple.createMotion(init)

	if active == true then
		cleanup(RunService.Heartbeat:Connect(function(delta)
			value(motion:step(delta))
		end))
	else
		effect(function()
			if not read(active) then return end

			cleanup(RunService.Heartbeat:Connect(function(delta)
				value(motion:step(delta))
			end))
		end)
	end

	return value, motion
end

return useMotion
