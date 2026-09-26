--[[
	Publishes a built plugin model as a new version of a Creator Store asset.

	zune run scripts/publish.luau --target canary --model UILabs.rbxm [--commit a1b2c3d]
	needs ROBLOX_API_KEY in the environment (or --key)

	Open Cloud cannot upload Plugin assets directly, so this does what Roblox's rbxasset
	v0.2.0 did before it dropped plugin support:
	  1. build a place with the model in ReplicatedStorage and save it to the uploader
	     experience (Place Publishing API)
	  2. run a script in that place through the Luau Execution API, which calls
	     `AssetService:CreateAssetVersionAsync` with `Enum.AssetType.Plugin`
	  3. read the new version number back from the task logs
	  4. update the name and description through the Assets API

	The API key needs, for the creator that owns the asset and the experience:
	  asset:read, asset:write, universe-places:write,
	  universe.place.luau-execution-session:write
]]

local process = zune.process
local fs = zune.fs
local http = zune.net.http
local json = zune.serde.json
local task = zune.task

local args = require("./args").parse(process.args)
local targets = require "./publish-targets"

local BASE_URL = "https://apis.roblox.com"
local TEMP_DIR = "publish"
local POLL_INTERVAL = 2
local TASK_TIMEOUT = 5 * 60

local function log(message: string)
	print(`[publish] {message}`)
end

local function fail(message: string): never
	log(message)
	return process.exit(1)
end

-- inputs --

local api_key = process.env.ROBLOX_API_KEY or args.key
if type(api_key) ~= "string" or api_key == "" then
	fail "ROBLOX_API_KEY must be set (or pass --key)"
end

if type(args.target) ~= "string" then
	fail "--target is required"
end
local target_name = args.target :: string
local target = targets.targets[target_name]
if not target then
	fail(`unknown target "{target_name}"`)
end
if target.asset_id <= 0 then
	fail(`target "{target_name}" has no asset_id set in scripts/publish-targets.luau`)
end

local environment = targets.environment
if environment.universe_id <= 0 or environment.place_id <= 0 then
	fail "the uploader experience is not set in scripts/publish-targets.luau"
end

local model = if type(args.model) == "string" then args.model else "UILabs.rbxm"
if not pcall(fs.stat, model) then
	fail(`model "{model}" does not exist, build it first`)
end

local commit: string? = if type(args.commit) == "string" then args.commit else nil

-- requests --

local function request(
	method: "GET" | "POST" | "PATCH",
	url: string,
	headers: { [string]: string }?,
	body: (string | buffer)?
): any
	local all_headers: { [string]: string } = { ["x-api-key"] = api_key :: string }
	if headers then
		for key, value in headers do
			all_headers[key] = value
		end
	end

	local response = http.request(url, {
		method = method,
		headers = all_headers,
		body = body,
	})

	if not response.ok then
		fail(`{method} {url} failed with {response.status_code} {response.status_reason}\n{response.body}`)
	end

	if response.body == "" then
		return nil
	end
	local ok, decoded = pcall(json.decode, response.body)
	return if ok then decoded else response.body
end

--- multipart body with a single json part named `request`, as the Assets API expects
local function json_form(value: any): (string, string)
	local boundary = `----UILabsPublish{os.time()}`
	local body = table.concat({
		`--{boundary}`,
		`Content-Disposition: form-data; name="request"`,
		"Content-Type: application/json",
		"",
		json.encode(value),
		`--{boundary}--`,
		"",
	}, "\r\n")
	return body, `multipart/form-data; boundary={boundary}`
end

-- 1. uploader place --

local function build_uploader_place(): string
	pcall(fs.deleteDir, TEMP_DIR, true)
	fs.makeDir(TEMP_DIR)

	fs.copy(model, `{TEMP_DIR}/model.rbxm`)

	local project = {
		name = "uploader",
		tree = {
			["$className"] = "DataModel",
			ReplicatedStorage = {
				UILabs = { ["$path"] = "model.rbxm" },
			},
		},
	}
	fs.writeFile(`{TEMP_DIR}/uploader.project.json`, json.encode(project))

	local place = `{TEMP_DIR}/uploader.rbxlx`
	local result = process.run("rojo", { "build", `{TEMP_DIR}/uploader.project.json`, "-o", place })
	if not result.ok then
		fail(`rojo build failed:\n{result.stdout}\n{result.stderr}`)
	end

	return place
end

local function save_place(place: string)
	local url =
		`{BASE_URL}/universes/v1/{environment.universe_id}/places/{environment.place_id}/versions?versionType=Saved`
	local response = request("POST", url, {
		["Content-Type"] = "application/xml",
		["Accept"] = "application/json",
	}, fs.readFile(place))

	log(`saved uploader place, version {response.versionNumber}`)
end

-- 2. luau execution task --

local TASK_SCRIPT = [[
local AssetService = game:GetService("AssetService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local instance = ReplicatedStorage:GetChildren()[1]
assert(instance, "no instance found in ReplicatedStorage")

local _, version = AssetService:CreateAssetVersionAsync(instance, Enum.AssetType.Plugin, ASSET_ID, {
	CreatorId = CREATOR_ID,
	CreatorType = Enum.AssetCreatorType.CREATOR_TYPE,
})

print(`VERSION_NUMBER={version}`)
]]

local function task_script(): string
	local script = `local ASSET_ID = {target.asset_id}\n`
		.. `local CREATOR_ID = {environment.creator_id}\n`
		.. TASK_SCRIPT:gsub("CREATOR_TYPE", environment.creator_type)
	return script
end

local function run_task(script: string): { [string]: string }
	local url =
		`{BASE_URL}/cloud/v2/universes/{environment.universe_id}/places/{environment.place_id}/luau-execution-session-tasks`
	local created = request("POST", url, { ["Content-Type"] = "application/json" }, json.encode { script = script })
	log(`started task {created.path}`)

	local started = os.clock()
	local current = created
	while current.state == "QUEUED" or current.state == "PROCESSING" do
		if os.clock() - started > TASK_TIMEOUT then
			fail "timed out waiting for the task"
		end
		task.wait(POLL_INTERVAL)
		current = request("GET", `{BASE_URL}/cloud/v2/{created.path}`)
	end

	local logs = request("GET", `{BASE_URL}/cloud/v2/{created.path}/logs`)
	local messages: { string } = {}
	local entries = logs and logs.luauExecutionSessionTaskLogs
	if entries and entries[1] and entries[1].messages then
		messages = entries[1].messages
	end

	local variables: { [string]: string } = {}
	for _, line in messages do
		log(`  {line}`)
		-- `%w` does not include `_`, so the class is spelled out
		local key, value = line:match "^([%w_]+)=(.-)%s*$"
		if key and value then
			variables[key] = value
		end
	end

	if current.state ~= "COMPLETE" then
		fail(`task ended in state {current.state}:\n{json.encode(current.error or current)}`)
	end

	return variables
end

-- 3. store details --

local function update_details()
	local body, content_type = json_form {
		assetId = target.asset_id,
		displayName = target.name,
		description = target.description(commit),
	}

	local url = `{BASE_URL}/assets/v1/assets/{target.asset_id}?updateMask=description,displayName`
	local operation = request("PATCH", url, { ["Content-Type"] = content_type }, body)

	if operation.message then
		fail(`updating details failed: {operation.message}`)
	end

	local started = os.clock()
	while operation.operationId and not operation.done do
		if os.clock() - started > TASK_TIMEOUT then
			fail "timed out waiting for the details update"
		end
		task.wait(POLL_INTERVAL)
		operation = request("GET", `{BASE_URL}/assets/v1/operations/{operation.operationId}`)
	end
end

-- run --

log(`publishing {model} to "{target.name}" ({target.asset_id})`)

local place = build_uploader_place()
save_place(place)

local variables = run_task(task_script())
local version = variables.VERSION_NUMBER
if not version then
	fail "the task did not report a version number"
end
log(`uploaded version {version}`)

update_details()
log "updated name and description"

pcall(fs.deleteDir, TEMP_DIR, true)
log "done"
