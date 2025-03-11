local fs = require "@lune/fs"
local process = require "@lune/process"
local task = require "@lune/task"

local install = require "./install"

local SERVE_DIR = "serve"
local DARKLUA_CONFIG = ".darklua.json"
local SOURCEMAP = "darklua-sourcemap.json"
local PACKAGES = "roblox_packages"

install()

pcall(fs.removeFile, SOURCEMAP)
pcall(fs.removeDir, SERVE_DIR)
pcall(fs.writeDir, SERVE_DIR)

fs.copy("build.project.json", SERVE_DIR .. "/build.project.json")
fs.copy("serve.project.json", SERVE_DIR .. "/serve.project.json")

fs.copy("src", SERVE_DIR .. "/src", true)
fs.copy(PACKAGES, SERVE_DIR .. "/" .. PACKAGES, true)

process.spawn("rojo", {
	"sourcemap",
	"serve.project.json",
	"-o",
	SOURCEMAP,
}, { stdio = "forward" })

print "RUNNING ROJO SOURCEMAP"

task.spawn(process.spawn, "rojo", {
	"sourcemap",
	"--watch",
	"serve.project.json",
	"-o",
	SOURCEMAP,
})

print "RUNNING DARK LUA"

task.spawn(process.spawn, "darklua", {
	"process",
	"-w",
	"--config",
	DARKLUA_CONFIG,
	"src",
	SERVE_DIR .. "/src",
})

print "RUNNING ROJO SERVE"

process.spawn("rojo", { "serve", SERVE_DIR .. "/serve.project.json" }, {
	stdio = "forward",
})
