--[[
	Shared steps to turn the source tree into a rojo-buildable directory:
	copy the project files, packages and vendor, then darklua the source.
]]

local process = zune.process
local fs = zune.fs

local compile = {}

compile.DARKLUA_CONFIG = ".darklua.json"
compile.SOURCEMAP = "darklua-sourcemap.json"
compile.PACKAGES = "roblox_packages"

compile.BUILD_PROJECT = "build.project.json"
compile.SERVE_PROJECT = "serve.project.json"
-- darklua resolves requires against this sourcemap. It must be the plugin tree, not the
-- DataModel one: under a DataModel darklua emits absolute `game:GetService(...)` paths
-- whenever they are shorter, and a plugin loaded from a file would then require the
-- copy synced into the place instead of its own modules
compile.SOURCEMAP_PROJECT = compile.BUILD_PROJECT

--- Runs a tool, printing its output. Returns whether it succeeded
function compile.run(exec: string, args: { string }): boolean
	local result = process.run(exec, args)

	if result.stdout ~= "" then
		print(result.stdout)
	end
	if result.stderr ~= "" then
		print(result.stderr)
	end
	if not result.ok then
		print(`{exec} exited with code {result.code}`)
	end

	return result.ok
end

function compile.generate_sourcemap(): boolean
	return compile.run("rojo", {
		"sourcemap",
		compile.SOURCEMAP_PROJECT,
		"-o",
		compile.SOURCEMAP,
	})
end

--- Recreates `out_dir` with everything rojo needs except the processed source
function compile.prepare(out_dir: string)
	pcall(fs.deleteFile, compile.SOURCEMAP)
	pcall(fs.deleteDir, out_dir, true)
	fs.makeDir(out_dir)

	fs.copy(compile.BUILD_PROJECT, `{out_dir}/{compile.BUILD_PROJECT}`)
	fs.copy(compile.SERVE_PROJECT, `{out_dir}/{compile.SERVE_PROJECT}`)

	fs.copy("src", `{out_dir}/src`)
	fs.copy("vendor", `{out_dir}/vendor`)
	fs.copy(compile.PACKAGES, `{out_dir}/{compile.PACKAGES}`)
end

--- Regenerates the sourcemap and darklua-processes src and vendor into `out_dir`
function compile.process(out_dir: string): boolean
	if not compile.generate_sourcemap() then
		return false
	end

	local ok = compile.run("darklua", {
		"process",
		"src",
		`{out_dir}/src`,
		"--config",
		compile.DARKLUA_CONFIG,
	})
	ok = compile.run("darklua", {
		"process",
		"vendor",
		`{out_dir}/vendor`,
		"--config",
		compile.DARKLUA_CONFIG,
	}) and ok

	return ok
end

return compile
