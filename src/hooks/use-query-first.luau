local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"

local function use_query_first<T...>(
	query: Derivable<ecs.Query<T...>>,
	predicator: ((ecs.Entity, T...) -> boolean)?
): Reactive<ecs.Entity?>
	local output = vide.source(nil :: ecs.Entity?)

	vide.effect(function()
		local query = vide.read(query) :: ecs.Query<any>
		if not query then
			output(nil)
			return
		end

		-- we need a query that is up-to-date
		local query_output = query:clone():cached()

		local monitor = query:monitor()
		monitor.added(function(entity)
			local first = query_output:first(predicator :: any)
			output(first)
		end)
		monitor.removed(function(entity)
			local first = query_output:first(predicator :: any)
			output(first)
		end)

		vide.cleanup(function()
			monitor.cleanup()
			query_output:cleanup()
		end)
	end)

	return output
end

return use_query_first
