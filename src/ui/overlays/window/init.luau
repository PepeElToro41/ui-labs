local Vide = require "@pkg/vide"

type WindowOverlayContext = {
	Window: Source<Frame>,
}

function WindowOverlay(props: ProviderChildren)
	return props.children()
end

return WindowOverlay
