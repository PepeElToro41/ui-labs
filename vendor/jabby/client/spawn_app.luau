local app_holder = require "@vendor/pebble/components/display/app_holder"
local vide = require(script.Parent.Parent.Parent.vide)
local types = require(script.Parent.Parent.modules.types)

local destroy_fn: { [() -> ()]: () -> () } = {}

local function unmount_all()
	for _, destroy in destroy_fn do
		destroy()
	end
end

local function spawn_app<T>(
	app: types.Application<T>,
	props: T,
	context: app_holder.SnapAreaContext?,
	target: any?
): () -> ()
	return vide.root(function(destroy)
		local cleanup = function()
			destroy_fn[destroy] = nil
			destroy()
		end
		local application
		if context then
			application = app_holder.context(context, function()
				return app.mount(props, cleanup)
			end)
			application.Parent = context.target
		else
			application = app_holder.app_holder {
				target = target,
				children = function()
					return app.mount(props, cleanup)
				end,
			}
			application.Parent = target
		end

		vide.cleanup(application)

		destroy_fn[destroy] = cleanup

		return cleanup
	end)
end

return {
	unmount_all = unmount_all,
	spawn_app = spawn_app,
}
