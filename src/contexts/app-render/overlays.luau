local Vide = require "@pkg/vide"
local Div = require "@styles/div"

type Source<T> = Vide.Source<T>
type Context<T> = Vide.Context<T>

local source = Vide.source
local action = Vide.action

type AppRenderContext = {
	Overlay: Source<Frame>,
	Contents: Source<Frame>,
}

local AppRenderContext: Context<AppRenderContext> = Vide.create_context()

function AppOverlaysProvider(props: ProviderChildren)
	local overlay: Source<Frame> = source()
	local contents: Source<Frame> = source()

	local context: AppRenderContext = {
		Overlay = overlay,
		Contents = contents,
	}

	return AppRenderContext.provide(context, function()
		return Div {
			Name = "AppHolder",

			Div { Name = "Overlay", ZIndex = 2, action(overlay) },
			Div {
				Name = "Contents",

				action(contents),
				props.children(),
			},
		}
	end)
end

function useAppOverlay()
	local context = AppRenderContext.consume()
	return context.Overlay
end

function useAppContents()
	local context = AppRenderContext.consume()
	return context.Contents
end

return table.freeze {
	AppOverlaysProvider = AppOverlaysProvider,
	useAppOverlay = useAppOverlay,
	useAppContents = useAppContents,
}
