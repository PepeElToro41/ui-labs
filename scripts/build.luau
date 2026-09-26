--[[
	One-shot plugin build: installs packages, darklua-processes the source into `build/`
	and rojo-builds the plugin model.

	zune run scripts/build.luau --output UILabs.rbxm [--skip-install]
]]

local compile = require "./compile"

local process = zune.process

local args = require("./args").parse(process.args)

local BUILD_DIR = "build"

local output = if type(args.output) == "string" then args.output else "UILabs.rbxm"

if not args["skip-install"] then
	print "INSTALLING PESDE"
	if not compile.run("pesde", { "install" }) then
		process.exit(1)
	end
end

print "PREPARING BUILD DIRECTORY"
compile.prepare(BUILD_DIR)

print "PROCESSING SOURCE"
if not compile.process(BUILD_DIR) then
	process.exit(1)
end

print "BUILDING PLUGIN"
local built = compile.run("rojo", {
	"build",
	`{BUILD_DIR}/{compile.BUILD_PROJECT}`,
	"-o",
	output,
})
if not built then
	process.exit(1)
end

print(`BUILT {output}`)
