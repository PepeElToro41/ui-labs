local Vide = require "@pkg/vide"

type Source<T> = Vide.Source<T>
type Context<T> = Vide.Context<T>

type MainPanelContext = {
	PanelExtends: Source<Vector2>,
}

local MainPanelContext: Context<MainPanelContext> = Vide.create_context()

function usePanelExtends()
	local context = MainPanelContext.consume()
	return context.PanelExtends
end

return {
	MainPanelContext = MainPanelContext,
	usePanelExtends = usePanelExtends,
}
