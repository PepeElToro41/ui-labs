local Vide = require("@pkg/vide")

local cleanup = Vide.cleanup

local UILabs = require("@pkg/ui-labs")
local Types = require("./types")
local MiscUtils = require("@utils/misc")
local WARNINGS = require("@constants/warnings")

local ycall = MiscUtils.ycall
local UILabsWarn = MiscUtils.UILabsWarn
local FastSpawn = MiscUtils.FastSpawn

type MounterProps<T> = Types.MounterProps<T>

function FunctionalStory(props: MounterProps<UILabs.FunctionStory>)
	local storyCleanup = ycall(props.Result, props.MountFrame, function(yield: boolean, err: string)
		if yield then
			UILabsWarn(WARNINGS.FunctionalYield)
		else
			UILabsWarn(WARNINGS.FunctionalError, err)
		end
	end)

	cleanup(function()
		if not storyCleanup then return UILabsWarn(WARNINGS.NoCleanup) end

		FastSpawn(function()
			local success, err: any = pcall(storyCleanup)
			if not success then UILabsWarn(WARNINGS.CleanupError, err .. " " .. debug.traceback()) end
		end)
	end)
end

return FunctionalStory
