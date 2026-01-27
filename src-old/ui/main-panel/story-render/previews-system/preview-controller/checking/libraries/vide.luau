local t = require "@pkg/t"
local UILabs = require "@pkg/ui-labs"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "vide" }

function Checker(lib: UILabs.VideStory): LibCheckReturn
	if lib.vide == nil then return "skip" end

	if not t.table(lib.vide) then return {
		Success = false,
		Error = "Vide library is not valid",
	} end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
