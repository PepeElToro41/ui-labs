local Vide = require "@pkg/vide"
local Div = require "@styles/div"

type Context<T> = Vide.Context<T>

local source = Vide.source
local action = Vide.action

type AppRenderContext = {
	Overlay: Source<Frame>,
	Contents: Source<Frame>,
}

local AppRenderContext: Context<AppRenderContext> = Vide.context()

function OverlayHolderProvider(props: ProviderChildren)
	local overlay: Source<Frame> = source()
	local contents: Source<Frame> = source()

	local context: AppRenderContext = {
		Overlay = overlay,
		Contents = contents,
	}

	return AppRenderContext(context, function()
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

function useOverlayHolder()
	local context = AppRenderContext()
	return context.Overlay
end

function useAppContents()
	local context = AppRenderContext()
	return context.Contents
end

return table.freeze {
	OverlayHolderProvider = OverlayHolderProvider,
	useOverlayHolder = useOverlayHolder,
	useAppContents = useAppContents,
}
