local Vide = require "@pkg/vide"

type Source<T> = Vide.Source<T>
type Context<T> = Vide.Context<T>

type MainPanelContext = {
	PanelExtends: Source<Vector2>,
}

local MainPanelContext = Vide.context({} :: MainPanelContext)

function usePanelExtends()
	local context = MainPanelContext()
	return context.PanelExtends
end

return {
	MainPanelContext = MainPanelContext,
	usePanelExtends = usePanelExtends,
}
