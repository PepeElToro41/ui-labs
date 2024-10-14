local t = require "@pkg/t"
local UILabs = require "@pkg/ui-labs"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "render" }

function Checker(lib: UILabs.GenericStory): LibCheckReturn
	if lib.render == nil then return "skip" end

	if not t.callback(lib.render) then return {
		Success = false,
		Error = "Generic render must be a function",
	} end

	if lib.render and (lib :: any)["story"] then
		return {
			Success = false,
			Error = 'Generic story cannot have both "render" and "story" key',
		}
	end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
