local Vide = require "@pkg/vide"
local AppOverlaysProvider = require("@contexts/app-render/overlays").AppOverlaysProvider
local UserInputProvider = require("@contexts/app-render/user-input").UserInputProvider

type Source<T> = Vide.Source<T>
type Context<T> = Vide.Context<T>

local ProviderStack = require("@utils/vide/contexts").ProviderStack

function AppRenderProvider(props: ProviderChildren)
	return ProviderStack {
		providers = { UserInputProvider, AppOverlaysProvider },
		children = props.children,
	}
end

return table.freeze {
	AppRenderProvider = AppRenderProvider,
}
