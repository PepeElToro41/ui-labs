local ecs = require "@vendor/ecs"

export type MounterProps<T> = {
	world: ecs.World,
	entity: ecs.Entity,
	module: ModuleScript,
	result: T,
	-- the frame the story renders into, owned by the mounters system
	target: Frame,
}

-- runs the story and returns its cleanup, nil when there is nothing to clean up
export type Mounter<T> = (props: MounterProps<T>) -> (() -> ())?

return nil
