local Vide = require "@pkg/vide"
local OverlayHolderProvider = require("@contexts/app-render/overlay-holder").OverlayHolderProvider
local UserInputProvider = require("@contexts/app-render/user-input").UserInputProvider

type Context<T> = Vide.Context<T>

local ProviderStack = require("@utils/vide/contexts").ProviderStack

function AppRenderProvider(props: ProviderChildren)
	return ProviderStack {
		providers = { UserInputProvider, OverlayHolderProvider },
		children = props.children,
	}
end

return table.freeze {
	AppRenderProvider = AppRenderProvider,
}
