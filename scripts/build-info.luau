--[[
	Writes `src/constants/build.luau` with the channel, version and commit of a build.

	zune run scripts/build-info.luau --channel canary --commit a1b2c3d
	zune run scripts/build-info.luau --channel release --version 2.1.0
	zune run scripts/build-info.luau                         (back to a local build)

	The version defaults to the one already in the file, so the canary CI keeps
	whatever is committed and the release CI passes the tagged one.
]]

local fs = zune.fs
local process = zune.process

local args = require("./args").parse(process.args)

local BUILD_FILE = "src/constants/build.luau"
local CHANNELS = { dev = true, canary = true, release = true }

local function fail(message: string): never
	print(`[build-info] {message}`)
	return process.exit(1)
end

local channel = if type(args.channel) == "string" then args.channel else "dev"
if not CHANNELS[channel] then
	fail(`unknown channel "{channel}", expected dev, canary or release`)
end

local commit: string? = if type(args.commit) == "string" then args.commit else nil
if channel == "canary" and not commit then
	fail "a canary build needs --commit <short hash>"
end

local existing = fs.readFile(BUILD_FILE)

local function read_version(): (string, string, string)
	if type(args.version) == "string" then
		local mayor, minor, fix = args.version:match "^v?(%d+)%.(%d+)%.(%d+)$"
		if not mayor then
			fail(`--version must look like 2.1.0, got "{args.version}"`)
		end
		return mayor :: string, minor :: string, fix :: string
	end

	local mayor = existing:match "mayor = (%d+)"
	local minor = existing:match "minor = (%d+)"
	local fix = existing:match "fix = (%d+)"
	if not (mayor and minor and fix) then
		fail(`could not read the current version from {BUILD_FILE}`)
	end
	return mayor :: string, minor :: string, fix :: string
end

local mayor, minor, fix = read_version()

-- everything before the values is kept as is
local header = existing:match "^(.-)local BUILD: Build = {"
if not header then
	fail(`could not find the BUILD table in {BUILD_FILE}`)
end

local commit_value = if commit then `"{commit}"` else "nil"

local contents = table.concat({
	header :: string .. "local BUILD: Build = {",
	`\tchannel = "{channel}",`,
	`\tversion = \{ mayor = {mayor}, minor = {minor}, fix = {fix} },`,
	`\tcommit = {commit_value},`,
	"}",
	"",
	"return BUILD",
	"",
}, "\n")

fs.writeFile(BUILD_FILE, contents)

print(`[build-info] {channel} v{mayor}.{minor}.{fix}{if commit then ` ({commit})` else ""}`)
