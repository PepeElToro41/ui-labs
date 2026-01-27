local Vide = require "@pkg/vide"
local Div = require "@base/div"

type Context<T> = Vide.Context<T>

local source = Vide.source
local action = Vide.action

type AppRenderContext = {
	Overlay: Source<Frame>,
	Contents: Source<Frame>,
	Holder: Source<Frame>,
}

local AppRenderContext: Context<AppRenderContext> = Vide.context()

function OverlayHolderProvider(props: ProviderChildren)
	local overlay: Source<Frame> = source()
	local contents: Source<Frame> = source()
	local holder: Source<Frame> = source()

	local context: AppRenderContext = {
		Overlay = overlay,
		Contents = contents,
		Holder = holder,
	}

	return AppRenderContext(context, function()
		return Div {
			Name = "AppHolder",
			action(holder),

			Div {
				Name = "Overlay",
				ZIndex = 2,
				action(overlay),
			},
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

function useAppHolder()
	local context = AppRenderContext()
	return context.Holder
end

return table.freeze {
	OverlayHolderProvider = OverlayHolderProvider,
	useOverlayHolder = useOverlayHolder,
	useAppContents = useAppContents,
	useAppHolder = useAppHolder,
}
