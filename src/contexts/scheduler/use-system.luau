local vide = require "@pkg/vide"
local SCHEDULER_CONTEXT = require "./scheduler-context"

local function use_system(system: SCHEDULER_CONTEXT.SystemCallback, order: number?)
	local context = SCHEDULER_CONTEXT()
	local added_system = context.add_system(system, order)

	vide.cleanup(function()
		context.remove_system(added_system)
	end)
end

return use_system
