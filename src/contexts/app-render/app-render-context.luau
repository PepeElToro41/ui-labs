local vide = require "@pkg/vide"

export type Popup = {
	--- whoever opened the popup, an owner only closes its own popup
	owner: unknown,
	--- called inside the overlay layer scope, returns the popup instance
	render: () -> Instance,
}

export type AppRender = {
	--- the whole app
	holder: Source<Frame?>,
	--- where the app ui lives
	contents: Source<Frame?>,
	--- layer above the contents, popups render here and use it as their canvas
	overlay: Source<Frame?>,

	--- the single open popup, opening a new one replaces it
	popup: Source<Popup?>,
	open_popup: (owner: unknown, render: () -> Instance) -> (),
	--- closes the open popup. When an owner is given, only if that owner opened it
	close_popup: (owner: unknown?) -> (),
}

local APP_RENDER_CONTEXT = vide.context() :: vide.Context<AppRender>
return APP_RENDER_CONTEXT
