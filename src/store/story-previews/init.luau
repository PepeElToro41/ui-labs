local Charm = require "@pkg/charm"
local HotReloader = require "@utils/hmr/hot-reloader"

type Atom<T> = Charm.Atom<T>
type HotReloader = HotReloader.HotReloader

-- This holds the data of a preview entry
export type StoryPreview = {
	UID: string,
	Key: string,
	Module: ModuleScript,
	Order: number,

	HotReloader: HotReloader?,
	Holder: Frame?,
	OverrideHolder: Frame?,

	InWidget: boolean,
	InViewport: boolean,
	Hidden: boolean,
	AutoReload: boolean,

	Zoom: number,
	Offset: Vector2,

	ContextTabs: Map<any, { Display: string, Render: () -> any }>,
}

local StoryPreviews: Atom<Map<string, StoryPreview>> = Charm.atom {}

return StoryPreviews
