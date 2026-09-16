local types = require "./types"

local utils = {}

--[[
	Resolves a string require path (e.g. "./sibling", "../parent/child", "@self/child", "@game/ReplicatedStorage/x")
	relative to `root`. Paths must start with ".", "..", "@self" or "@game".
	If the resolved instance is not a ModuleScript, its "init" or "Init" child is used instead.
]]
function utils.resolve_string_path(root: Instance, path: string): Instance
	local parts = string.split(path, "/")
	local current: Instance = root.Parent :: Instance

	if #parts == 0 then
		error(`Invalid relative path: {path}`, 2)
	end

	local first = parts[1]
	if first ~= "." and first ~= ".." and first ~= "@self" and first ~= "@game" then
		error(`Invalid path start: "{first}" in {path}`, 2)
	end

	for _, part in parts do
		if part == "" then
			error(`Double slashes are not allowed in path: {path}`, 2)
		end

		if part == ".." then
			local parent = current.Parent
			if parent == nil then
				error(`No parent found in: {current:GetFullName()}`, 2)
			end
			current = parent
		elseif part == "." then
			-- stay at current
		elseif part == "@self" then
			current = root
		elseif part == "@game" then
			current = game
		else
			local child = current:FindFirstChild(part)
			if child == nil then
				error(`Unknown script {part} in: {current:GetFullName()}`, 2)
			end
			current = child
		end
	end

	if not current:IsA "ModuleScript" then
		local init_file = current:FindFirstChild "init" or current:FindFirstChild "Init"
		if init_file == nil then
			error(`No init file found in: {current:GetFullName()}`, 2)
		end
		current = init_file
	end

	return current
end

function utils.set_environment(virtual_module: () -> any, module: ModuleScript, environment: types.Environment)
	local globals = {
		_G = environment.shared,
		script = module,
		require = function(target: any)
			local resolved: ModuleScript

			if type(target) == "string" then
				local string_resolved = utils.resolve_string_path(module, target)
				if not string_resolved:IsA "ModuleScript" then
					error(`Resolved dependency {target} is not a ModuleScript`, 2)
				end
				resolved = string_resolved
			elseif typeof(target) == "Instance" then
				if not target:IsA "ModuleScript" then
					error(`Dependency {target:GetFullName()} is not a ModuleScript`, 2)
				end
				if target == module then
					error(`Circular dependency detected: {module:GetFullName()}`, 2)
				end
				resolved = target
			else
				error(`Could not resolve require {tostring(target)} in {module:GetFullName()}`, 2)
			end

			return environment:load_dependency(resolved)
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
