local compile = require "./compile"
local watch = require "./watch"

local process = zune.process

local SERVE_DIR = "serve"

print "GENERATING SOURCEMAP"

compile.generate_sourcemap()

print "INSTALLING PESDE"

process.run("pesde", {
	"install",
})

print "CREATING DIRECTORIES"

compile.prepare(SERVE_DIR)

local function compile_project()
	compile.process(SERVE_DIR)
	print "COMPILED, WAITING FOR FILE CHANGES..."
end

watch("src", 0.1, function()
	print "FILE CHANGED, REPROCESSING..."
	compile_project()
end)
watch("vendor", 0.1, function()
	print "FILE CHANGED, REPROCESSING..."
	compile_project()
end)

compile_project()

process.run("rojo", {
	"serve",
	`{SERVE_DIR}/{compile.SERVE_PROJECT}`,
})
