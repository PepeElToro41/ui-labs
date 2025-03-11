local vide = require "@pkg/real-vide"
local videcharm = require "@pkg/vide-charm"
local charm = require "@pkg/charm"

local story = {
	vide = vide,
	story = function()
		local str_atom = charm.atom "hi"
		local str_src = videcharm.useAtom(str_atom)

		vide.effect(function()
			print(str_src())
		end)

		str_atom "nope"
		str_atom "yes"
	end,
}

return story
