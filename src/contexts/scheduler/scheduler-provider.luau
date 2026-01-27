local RunService = game:GetService "RunService"

local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local array = require "@utils/array"

local SCHEDULER_CONTEXT = require "./scheduler-context"
local SYSTEM_ORDER = require "./system-order"

type System = SCHEDULER_CONTEXT.System
type SystemCallback = SCHEDULER_CONTEXT.SystemCallback

local function scheduler_provider(props: ProviderChildren)
	local systems: { System } = {}

	local function add_system(system: SystemCallback, order: number?): System
		local new_system: System = {
			system = system,
			order = order or SYSTEM_ORDER.default,
		}

		table.insert(systems, new_system)
		array.bubble_sort(systems, function(a, b)
			return a.order < b.order
		end)

		return new_system
	end

	local function remove_system(system: System)
		local init_index = table.find(systems, system)
		if init_index then
			table.remove(systems, init_index)
		end
	end

	local runner = RunService.Heartbeat:Connect(function(delta)
		for _, system in systems do
			system.system(delta)
		end
	end)
	vide.cleanup(runner)

	return SCHEDULER_CONTEXT({
		systems = systems,
		add_system = add_system,
		remove_system = remove_system,
	}, props.children)
end

return scheduler_provider
