local t = require "@pkg/t"
local UILabs = require "@pkg/ui-labs"
local Types = require "../types"

type LibCheckReturn = Types.LibCheckReturn

local KEYS = { "roact" }

local function Checker(lib: UILabs.RoactStory): LibCheckReturn
	if lib.roact == nil then return "skip" end

	if not t.table(lib.roact) then return {
		Success = false,
		Error = "Roact library is not valid",
	} end

	return "valid"
end

return {
	Checker = Checker,
	Keys = KEYS,
}
