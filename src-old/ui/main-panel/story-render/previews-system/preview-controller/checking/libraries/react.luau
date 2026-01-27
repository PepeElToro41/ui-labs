local t = require "@pkg/t"
local UILabs = require "@pkg/ui-labs"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "react", "reactRoblox", "renderer" }

local function Checker(lib: UILabs.ReactStory): LibCheckReturn
	if lib.react == nil then return "skip" end
	if lib.reactRoblox == nil then return "skip" end

	if not t.table(lib.react) then return {
		Success = false,
		Error = "React library is not valid",
	} end

	if not t.table(lib.reactRoblox) then
		return {
			Success = false,
			Error = "ReactRoblox library is not valid",
		}
	end

	local renderer = (lib :: any)["renderer"]
	if renderer ~= nil then
		if not t.literal("deferred", "legacy")(renderer) then
			return {
				Success = false,
				Error = `Renderer key must be "deferred" or "legacy" for React, got {renderer}`,
			}
		end
	end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
