local t = require "@pkg/t"
local UILabs = require "@pkg/ui-labs"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "iris" }

function Checker(lib: UILabs.IrisStory): LibCheckReturn
	if lib.iris == nil then return "skip" end

	if not t.table(lib.iris) then return {
		Success = false,
		Error = "Iris library is not valid",
	} end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
