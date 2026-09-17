local control_types = require "@src/systems/controls/types"
local ecs = require "@vendor/ecs"

export type MounterProps<T> = {
	world: ecs.World,
	entity: ecs.Entity,
	module: ModuleScript,
	result: T,
	-- the frame the story renders into, owned by the mounters system
	target: Frame,
	-- the story's converted controls; their entities already exist under `entity`
	controls: control_types.ConvertedControls,
}

-- runs the story and returns its cleanup, nil when there is nothing to clean up
export type Mounter<T> = (props: MounterProps<T>) -> (() -> ())?

return nil
