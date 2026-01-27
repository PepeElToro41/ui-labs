local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"

export type SystemCallback = (delta: number) -> ()

export type System = {
	system: SystemCallback,
	order: number,
}

export type SchedulerContext = {
	systems: { System },
	add_system: (system: SystemCallback, order: number?) -> System,
	remove_system: (system: System) -> (),
}

local SCHEDULER_CONTEXT = vide.context() :: vide.Context<SchedulerContext>
return SCHEDULER_CONTEXT
