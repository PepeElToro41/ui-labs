import Immut from "@rbxts/immut";
import { createProducer } from "@rbxts/reflex";
import { HttpService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import { HotReloader } from "Utils/HotReloader/HotReloader";

declare global {
	interface PreviewEntry {
		UID: string;
		Key: string;
		Module: ModuleScript;
		EnvironmentTarget?: string; // nil for root, otherwise the PreviewUID to share environment with

		HotReloader?: HotReloader; // Assigned on Runtime (UI/StoryPreview/PreviewController/index)
		Holder?: Frame; // Assigned on Runtime (UI/StoryPreview/PreviewController/index)
		ListenerFrame?: Frame; // Assigned on Runtime (UI/StoryPreview/PreviewController/index)
		OverrideHolder?: Instance; // Assigned with the Enviroment

		OnWidget: boolean;
		OnViewport: boolean;
		Visible: boolean;
		AutoReload: boolean;
		RecoverControls: boolean;

		Zoom: number;
		Offset: Vector2;
		Order: number;

		ActionComponents: Map<string, ActionTabEntry>; // Tabs that are renderer in the story preview
	}
}
const DefaultEntry = {
	Zoom: 100,
	Offset: Vector2.zero,

	Visible: true,
	OnWidget: false,

	OnViewport: false,
	AutoReload: true
} satisfies Partial<PreviewEntry>;

interface StoryPreviewState {
	mountPreviews: Map<string, PreviewEntry>;
	latestViewOnViewport: boolean;
}

const initialState: StoryPreviewState = {
	mountPreviews: new Map(),
	latestViewOnViewport: false
};

const MIN_ZOOM = 10;
const MAX_ZOOM = 26000;

export const selectStoryPreview = (state: RootState) => state.storyPreview;
export const selectStoryPreviews = (state: RootState) => selectStoryPreview(state).mountPreviews;
export const selectPreview = (key?: string) => (state: RootState) => {
	if (key === undefined) {
		//key can be undefined mostly for react hooks purposes
		return undefined;
	}
	return GetEntryByKey(selectStoryPreview(state).mountPreviews, key);
};

//gives you the amount of previews of the given module

export const selectMountAmount = (module: ModuleScript) => (state: RootState) => {
	const previews = selectStoryPreviews(state);
	let found = 0;
	previews.forEach((entry) => {
		if (entry.Module === module) {
			found++;
		}
	});
	return found;
};

function CreateNewEntry(module: ModuleScript, order: number) {
	const uid = HttpService.GenerateGUID(false);
	const newEntry: PreviewEntry = {
		...DefaultEntry,
		UID: uid,
		Key: uid,
		RecoverControls: true,
		Module: module,
		Order: order,
		ActionComponents: new Map()
	};
	return newEntry;
}
export function GetEntryByUID(previews: Map<string, PreviewEntry>, uid: string) {
	for (const [_, entry] of previews) {
		if (entry.UID === uid) {
			return entry;
		}
	}
}
export function GetEntryByKey(previews: Map<string, PreviewEntry>, key: string) {
	return previews.get(key) ?? GetEntryByUID(previews, key);
}

function MountStory(state: StoryPreviewState, module: ModuleScript, keepViewOnViewport: boolean) {
	const rootStory = state.mountPreviews.get(Configs.RootPreviewKey);
	const listSize = rootStory ? rootStory.Order : state.mountPreviews.size();

	//For all stories, Key is equal to UID, but for the root story, key is always Configs.RootPreviewKey ("RootStory")
	const entry = CreateNewEntry(module, listSize);
	entry.Key = Configs.RootPreviewKey;

	if (keepViewOnViewport) {
		entry.OnViewport = state.latestViewOnViewport;
	}
	return Immut.produce(state, (draft) => {
		draft.mountPreviews.set(Configs.RootPreviewKey, entry);
	});
}
function GetOrderedEntryMap(
	entryMap: Map<string, PreviewEntry>,
	predicator?: (entry: PreviewEntry, uid: string) => boolean
) {
	const sorted: PreviewEntry[] = [];
	entryMap.forEach((entry, uid) => {
		if (predicator) {
			if (predicator(entry, uid)) {
				sorted.push(entry);
			}
		} else {
			sorted.push(entry);
		}
	});
	return sorted.sort((a, b) => a.Order < b.Order);
}

function FromOrderedEntryMap(list: PreviewEntry[]) {
	const entryMap = new Map<string, PreviewEntry>();
	list.forEach((entry, index) => {
		entryMap.set(entry.Key, {
			...entry,
			Order: index
		});
	});
	return entryMap;
}

function FilterEntryMap(
	entryMap: Map<string, PreviewEntry>,
	predicator: (entry: PreviewEntry, uid: string) => boolean
) {
	const sorted: PreviewEntry[] = [];
	entryMap.forEach((entry, uid) => {
		if (predicator(entry, uid)) {
			sorted.push(entry);
		}
	});

	sorted.sort((a, b) => a.Order < b.Order);
	return FromOrderedEntryMap(sorted);
}
//This saves all the stories that are mounted with the state it has (zoom, offset, hotreloader)
export const StoryPreviewProducer = createProducer(initialState, {
	//---[MOUNTING/UNMOUNTING]---//
	mountStory: MountStory,

	mountOnTop: (state, module: ModuleScript) => {
		const listSize = state.mountPreviews.size();
		const entry = CreateNewEntry(module, listSize);

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(entry.UID, entry);
		});
	},
	mountOnWidget: (state, module: ModuleScript) => {
		const listSize = state.mountPreviews.size() + 1;
		const entry = CreateNewEntry(module, listSize);
		entry.OnWidget = true;
		entry.OnViewport = false;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(entry.Key, entry);
		});
	},
	unmountStory: (state, key: string = Configs.RootPreviewKey) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.Key !== key)
		};
	},
	unmountByUID: (state, uid: string) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.UID !== uid)
		};
	},
	unmountByModule: (state, module: ModuleScript) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.Module !== module)
		};
	},
	toggleMount: (state, module: ModuleScript, keepViewOnViewport: boolean) => {
		const rootStory = state.mountPreviews.get(Configs.RootPreviewKey);
		if (rootStory && rootStory.Module === module) {
			return Immut.produce(state, (draft) => {
				draft.mountPreviews.delete(Configs.RootPreviewKey);
			});
		}
		return MountStory(state, module, keepViewOnViewport);
	},
	//---[MOUNT DATA]---//
	shiftOrderBefore: (state, key: string) => {
		const entry = GetEntryByKey(state.mountPreviews, key);
		if (!entry) return state;
		if (entry.Order === 0) {
			// Already at the start
			return state;
		}

		const index = entry.Order;
		const ordered = GetOrderedEntryMap(state.mountPreviews);
		[ordered[index], ordered[index - 1]] = [ordered[index - 1], ordered[index]];

		return {
			...state,
			mountPreviews: FromOrderedEntryMap(ordered)
		};
	},
	shiftOrderAfter: (state, key: string) => {
		const entry = GetEntryByKey(state.mountPreviews, key);
		if (!entry) return state;
		if (entry.Order === state.mountPreviews.size()) {
			// Already at the end
			return state;
		}

		const index = entry.Order;
		const ordered = GetOrderedEntryMap(state.mountPreviews);
		[ordered[index], ordered[index + 1]] = [ordered[index + 1], ordered[index]];

		return {
			...state,
			mountPreviews: FromOrderedEntryMap(ordered)
		};
	},
	setMountData: (state, key: string, data: Partial<PreviewEntry>) => {
		const oldData = GetEntryByKey(state.mountPreviews, key);
		if (!oldData) return state;

		const updatedData = {
			...oldData,
			...data
		};
		return Immut.produce(state, (draft) => {
			if (updatedData.Key === Configs.RootPreviewKey) {
				draft.latestViewOnViewport = updatedData.OnViewport;
			}
			draft.mountPreviews.set(key, updatedData);
		});
	},
	updateMountData: (state, key: string, updater: (current: PreviewEntry) => PreviewEntry) => {
		const current = GetEntryByKey(state.mountPreviews, key);
		if (!current) return state;

		const updatedData = updater(current);
		if (updatedData === current) return state;

		return Immut.produce(state, (draft) => {
			if (updatedData.Key === Configs.RootPreviewKey) {
				draft.latestViewOnViewport = updatedData.OnViewport;
			}
			draft.mountPreviews.set(current.Key, updatedData);
		});
	},
	/**
	 * Zooms by adding a delta.
	 * A positive delta zooms in. (100 applies a +100% zoom)
	 * Optionally, providing an offset of the cursor relative to the holder's anchor will ensure that the content at that location stays in place.
	 */
	addZoom: (state, key: string, zoomDelta: number, cursorOffset?: Vector2) => {
		const current = GetEntryByKey(state.mountPreviews, key);
		if (!current) return state;

		const newZoom = math.clamp(current.Zoom + zoomDelta, MIN_ZOOM, MAX_ZOOM);

		if (newZoom === current.Zoom) return state;

		let newOffset: Vector2;
		if (cursorOffset) {
			const scalingFactor = newZoom / current.Zoom;
			const offsetAdjustment = cursorOffset.mul(1 - scalingFactor);
			newOffset = current.Offset.add(offsetAdjustment);
		} else {
			newOffset = current.Offset;
		}

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, {
				...current,
				Zoom: newZoom,
				Offset: newOffset
			});
		});
	},
	setZoom: (state, key: string, zoom: number) => {
		const current = GetEntryByKey(state.mountPreviews, key);
		if (!current) return state;

		const newZoom = math.clamp(zoom, MIN_ZOOM, MAX_ZOOM);
		if (newZoom === current.Zoom) return state;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, {
				...current,
				Zoom: zoom
			});
		});
	},

	setActionComponents: (state, key: string, components: Map<string, ActionTabEntry>) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, {
				...entry,
				ActionComponents: components
			});
		});
	},
	setActionComponent: (state, key: string, index: string, actionEntry: ActionTabEntry) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.get(key)!.ActionComponents.set(index, actionEntry);
		});
	},
	unsetActionComponent: (state, key: string, index: string) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.get(key)!.ActionComponents.delete(index);
		});
	}
});
