--[[
	Where `scripts/publish.luau` publishes to. Every target is an existing Creator Store
	asset owned by the creator below, the script only uploads new versions.

	The environment is a plain experience owned by the same creator, used to run the
	upload through Open Cloud Luau execution. Any published baseplate works.
]]

export type Target = {
	--- id of the Creator Store asset that receives the new version
	asset_id: number,
	--- display name on the Creator Store
	name: string,
	--- description on the Creator Store, receives the short commit hash when known
	description: (commit: string?) -> string,
}

export type Environment = {
	creator_id: number,
	creator_type: "User" | "Group",
	--- `game.GameId` of the uploader experience
	universe_id: number,
	--- `game.PlaceId` of the uploader experience
	place_id: number,
}

local environment: Environment = {
	creator_id = 423902024,
	creator_type = "User",
	universe_id = 10768090573, -- TODO: uploader experience
	place_id = 130294875197947, -- TODO: uploader experience
}

local targets: { [string]: Target } = {
	canary = {
		asset_id = 86854165936676, -- TODO: canary plugin
		name = "UI Labs (Canary)",
		description = function(commit)
			return `Automatic build of UI Labs from the latest commit{if commit then ` ({commit})` else ""}.\n`
				.. "Unstable, use the release plugin unless you want to try what is coming next:\n"
				.. "https://create.roblox.com/store/asset/14293316215"
		end,
	},
	release = {
		asset_id = 14293316215,
		name = "UI Labs",
		description = function()
			return "UI Labs is a storybook plugin to preview your UI in real time without running your game."
		end,
	},
}

return {
	environment = environment,
	targets = targets,
}

