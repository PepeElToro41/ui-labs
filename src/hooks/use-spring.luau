local RunService = game:GetService "RunService"

local ripple = require "@pkg/ripple"
local vide = require "@pkg/vide"
local utils = require "@utils"

local function use_spring<T>(init: T, active: Derivable<boolean>?): (Reactive<T>, ripple.Spring<T>)
	local output = vide.source(init)
	local motion = ripple.createSpring(init)
	active = utils.nonnil(active, true)

	if active == true then
		vide.cleanup(RunService.Heartbeat:Connect(function(delta)
			output(motion:step(delta))
		end))
	else
		vide.effect(function()
			if not vide.read(active) then
				return
			end

			vide.cleanup(RunService.Heartbeat:Connect(function(delta)
				output(motion:step(delta))
			end))
		end)
	end

	return output, motion
end

return use_spring
