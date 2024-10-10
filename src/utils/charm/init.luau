local Charm = require("@pkg/charm")
local Vide = require("@pkg/vide")

function useAtom<T>(molecule: Charm.Molecule<T>, ...: Derivable<any>): Vide.Source<T>
	local hook = Vide.source(Vide.untrack(molecule))
	local deps = { ... }

	if #deps > 0 then
		Vide.effect(function()
			for _, dependency in ipairs(deps) do
				Vide.read(dependency)
			end

			hook(Vide.untrack(molecule))
			Vide.cleanup(Charm.subscribe(molecule, hook))
		end)
	else
		Vide.cleanup(Charm.subscribe(molecule, hook))
	end

	return hook
end

return table.freeze {
	useAtom = useAtom,
}
