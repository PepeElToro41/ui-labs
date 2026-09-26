local c = require "@src/components"
local controls = require "@src/systems/controls"
local ecs = require "@vendor/ecs"

--- Converts a table story's `controls` and spawns the control entities under the preview,
--- recovering the values of the previous mount when the preview keeps them
local function create_controls(world: ecs.World, preview: ecs.Entity, returned: Map<string, unknown>?, prefix: string)
	local converted: controls.ConvertedControls = if returned then controls.convert(returned, prefix) else {}
	controls.create(world, preview, converted, world.get(preview, c.control_recovery))
end

return create_controls
