local net = zune.net
local process = zune.process
local fs = zune.fs

local DEFINITIONS = "types"
local DOWNLOAD_ROBLOX_DEFINITIONS = true
local GENERATED_DEFS = "generated.d.luau"

local ROBLOX_DEFINITIONS =
	"https://raw.githubusercontent.com/JohnnyMorganz/luau-lsp/main/scripts/globalTypes.PluginSecurity.d.luau"

local function generate_definitions()
	local definition_contents = ""

	if DOWNLOAD_ROBLOX_DEFINITIONS then
		definition_contents ..= net.http.request(ROBLOX_DEFINITIONS).body
	end

	local function append_definition(file: string)
		local contents = fs.readFile(file)
		definition_contents = definition_contents .. "\n\n" .. contents
	end

	if DEFINITIONS and DEFINITIONS ~= "" then
		local stat = fs.stat(DEFINITIONS)
		if stat.kind == "directory" then
			for _, entry in fs.entries(DEFINITIONS) do
				local substat = fs.stat(fs.path.join(DEFINITIONS, entry.name))
				if substat.kind == "file" then
					append_definition(fs.path.join(DEFINITIONS, entry.name))
				end
			end
		elseif stat.kind == "file" then
			append_definition(DEFINITIONS)
		end
	end

	if definition_contents ~= "" then
		if fs.stat(GENERATED_DEFS).kind == "file" then
			fs.deleteFile(GENERATED_DEFS)
		end

		local newDefinitions = fs.createFile(GENERATED_DEFS)
		newDefinitions:write(definition_contents)
	end
end

local function analyze(path: string)
	local result = process.run("luau-lsp", {
		-- flags must come before the path, anything after it is treated as another path
		"analyze",
		`--definitions={GENERATED_DEFS}`,
		"--no-flags-enabled",
		"--ignore=roblox_packages/**",
		"--ignore=vendor/**",
		path,
	})

	if result.stdout ~= "" then
		print(result.stdout)
	end
	if result.stderr ~= "" then
		print(result.stderr)
	end
	if not result.ok then
		process.exit(result.code)
	end
end

generate_definitions()
analyze "src"

return {
	generate_definitions = generate_definitions,
	analyze = analyze,
}
