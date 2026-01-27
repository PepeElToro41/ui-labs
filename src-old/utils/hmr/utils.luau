local Environment = require "./common"
local Promise = require "@pkg/promise"

type Environment = Environment.Environment
type Promise<T = any> = Promise.TypedPromise<T>

function SetEnvironment(virtual: () -> any, module: ModuleScript, environment: Environment)
	local globals = {
		require = function(module)
			if typeof(module) ~= "Instance" then error("require must be called with a ModuleScript", 2) end
			if not module:IsA("ModuleScript") then error("require must be called with a ModuleScript", 2) end

			return environment:LoadDependency(module):expect()
		end,
		script = module,
		_G = environment.Shared,
	}

	local env = getfenv()
	local injection = environment:GetGlobalInjection()
	local index = (injection and setmetatable(injection, { __index = env })) or env

	local virtualEnv = setmetatable(globals, { __index = index }) :: any
	setfenv(virtual, virtualEnv)
end

function VirtualRequire(module: ModuleScript, environment: Environment): Promise
	return Promise.try(function()
		local virtual, err = loadstring(module.Source, module:GetFullName())
		if not virtual then error(err) end

		SetEnvironment(virtual, module, environment)

		local success, result = pcall(virtual)
		if success then
			return result
		else
			error(result)
		end
	end)
end

return table.freeze {
	SetEnvironment = SetEnvironment,
	VirtualRequire = VirtualRequire,
}
