local ProviderStack = require("@utils/vide/contexts").ProviderStack
local useOverlayHolder = require("@contexts/app-render/overlay-holder").useOverlayHolder

local WindowOverlay = require "./window"
local TooltipOverlay = require "./tooltip"

function OverlaysRenderer(props: { children: () -> any })
	return ProviderStack {
		providers = {
			WindowOverlay,
			TooltipOverlay,
		},
		children = props.children,
	}
end

return OverlaysRenderer
