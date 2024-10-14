local UILabs = require "@pkg/ui-labs"
local t = require "@pkg/t"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "fusion", "scoped" }

function Checker(lib: UILabs.FusionStory): LibCheckReturn
	if lib.fusion == nil then return "skip" end

	if not t.table(lib.fusion) then return {
		Success = false,
		Error = "Fusion library is not valid",
	} end

	if lib.scoped then
		if not t.array(t.any)(lib.scoped) then
			return {
				Success = false,
				Error = "Scoped key must be an array of scopable tables",
			}
		end
	end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
