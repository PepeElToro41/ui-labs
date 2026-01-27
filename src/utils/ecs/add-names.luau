local ecs = require "@vendor/ecs"

local function add_names(components: { [string]: ecs.Entity })
	for name, component in components do
		ecs.meta(component, ecs.Name, name)
	end
end

return add_names
