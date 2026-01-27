local types = require "./types"

local utils = {}

function utils.set_environment(virtual_module: () -> any, module: ModuleScript, environment: types.Environment)
	local globals = {
		_G = environment.shared,
		script = module,
		require = function()
			return environment:load_dependency(module)
		end,
	}
	local env = getfenv()
	local injection = environment:get_injection()
	local base_env = injection and setmetatable(injection, { __index = env }) or env

	local virtual_env = setmetatable(globals, { __index = base_env }) :: any
	setfenv(virtual_module, virtual_env)
end

function utils.load_virtual_module(module: ModuleScript, environment: types.Environment): (boolean, any)
	local virtual_module, err = loadstring(module.Source, module:GetFullName())
	if not virtual_module then
		return false, err
	end

	utils.set_environment(virtual_module, module, environment)

	local success, result = pcall(virtual_module)
	return success, result
end

return utils
