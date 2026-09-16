local watch = require "./watch"

local process = zune.process
local fs = zune.fs

local SERVE_DIR = "serve"
local DARKLUA_CONFIG = ".darklua.json"
local SOURCEMAP = "darklua-sourcemap.json"
local PACKAGES = "roblox_packages"

local BUILD_PROJECT = "build.project.json"
local SERVE_PROJECT = "serve.project.json"
local SOURCEMAP_PROJECT = SERVE_PROJECT

print "GENERATING SOURCEMAP"

process.run("rojo", {
	"sourcemap",
	SOURCEMAP_PROJECT,
	"-o",
	SOURCEMAP,
})

print "INSTALLING PESDE"

process.run("pesde", {
	"install",
})

print "CREATING DIRECTORIES"

fs.deleteFile(SOURCEMAP)
fs.deleteDir(SERVE_DIR, true)
fs.makeDir(SERVE_DIR)

fs.copy(BUILD_PROJECT, `{SERVE_DIR}/{BUILD_PROJECT}`)
fs.copy(SERVE_PROJECT, `{SERVE_DIR}/{SERVE_PROJECT}`)

fs.copy("src", `{SERVE_DIR}/src`)
fs.copy("vendor", `{SERVE_DIR}/vendor`)
fs.copy(PACKAGES, `{SERVE_DIR}/{PACKAGES}`)

local function compile_project()
	process.run("rojo", {
		"sourcemap",
		SOURCEMAP_PROJECT,
		"-o",
		SOURCEMAP,
	})

	print "COMPILED, WAITING FOR FILE CHANGES..."
	process.run("darklua", {
		"process",
		"src",
		`{SERVE_DIR}/src`,
		"--config",
		DARKLUA_CONFIG,
	})
	process.run("darklua", {
		"process",
		"vendor",
		`{SERVE_DIR}/vendor`,
		"--config",
		DARKLUA_CONFIG,
	})
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

print "COMPILED, WAITING FOR FILE CHANGES..."
process.run("rojo", {
	"serve",
	`{SERVE_DIR}/{SERVE_PROJECT}`,
})
