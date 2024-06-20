import Immut from "@rbxts/immut";
import { createProducer } from "@rbxts/reflex";
import { HttpService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import type { HotReloader } from "Utils/HotReloader";

declare global {
	interface PreviewEntry {
		UID: string;
		Key: string;
		Module: ModuleScript;
		HotReloader?: HotReloader;
		Holder?: Frame;

		OnWidget: boolean;
		OnViewport: boolean;
		Visible: boolean;
		AutoReload: boolean;

		Zoom: number;
		Offset: Vector2;
		Order: number;

		ActionComponents: Map<string, ActionTabEntry>;

		ZIndexBehavior?: Enum.ZIndexBehavior;
	}
}
const DefaultEntry = {
	Zoom: 100,
	Offset: Vector2.zero,

	Visible: true,
	OnWidget: false,
	OnViewport: false,
	AutoReload: true,
	ZIndexBehavior: Enum.ZIndexBehavior.Sibling,
} satisfies Partial<PreviewEntry>;

interface StoryMountState {
	mountPreviews: Map<string, PreviewEntry>;
}

const initialState: StoryMountState = {
	mountPreviews: new Map(),
};

export const selectStoryMount = (state: RootState) => state.storyPreview.mount;
export const selectStoryPreviews = (state: RootState) => selectStoryMount(state).mountPreviews;
export const selectPreview = (key?: string) => (state: RootState) => {
	if (key === undefined) {
		//key can be undefined mostly for react hooks purposes
		return undefined;
	}
	return selectStoryPreviews(state).get(key);
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
		Module: module,
		Order: order,
		ActionComponents: new Map(),
	};
	return newEntry;
}

function MountStory(state: StoryMountState, module: ModuleScript) {
	const rootStory = state.mountPreviews.get(Configs.RootPreviewKey);
	const listSize = rootStory ? rootStory.Order : state.mountPreviews.size() + 1;

	//For all stories, Key is equal to UID, but for the root story, key is always Configs.RootPreviewKey ("RootStory")
	const entry = CreateNewEntry(module, listSize);
	entry.Key = Configs.RootPreviewKey;
	return Immut.produce(state, (draft) => {
		draft.mountPreviews.set(Configs.RootPreviewKey, entry);
	});
}
function GetOrderedEntryMap(entryMap: Map<string, PreviewEntry>, predicator?: (entry: PreviewEntry, uid: string) => boolean) {
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
			Order: index + 1,
		});
	});
	return entryMap;
}

function FilterEntryMap(entryMap: Map<string, PreviewEntry>, predicator: (entry: PreviewEntry, uid: string) => boolean) {
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
export const StoryMountProducer = createProducer(initialState, {
	//---[MOUNTING/UNMOUNTING]---//
	mountStory: MountStory,
	mountOnTop: (state, module: ModuleScript) => {
		const listSize = state.mountPreviews.size() + 1;
		const entry = CreateNewEntry(module, listSize);

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(entry.UID, entry);
		});
	},
	mountOnWidget: (state, module: ModuleScript) => {
		const listSize = state.mountPreviews.size() + 1;
		const entry = CreateNewEntry(module, listSize);
		entry.OnWidget = true;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(entry.Key, entry);
		});
	},
	unmountStory: (state, key: string = Configs.RootPreviewKey) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.Key !== key),
		};
	},
	unmountByUID: (state, uid: string) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.UID !== uid),
		};
	},
	unmountByModule: (state, module: ModuleScript) => {
		return {
			...state,
			mountPreviews: FilterEntryMap(state.mountPreviews, (entry) => entry.Module !== module),
		};
	},
	toggleMount: (state, module: ModuleScript) => {
		const rootStory = state.mountPreviews.get(Configs.RootPreviewKey);
		if (rootStory && rootStory.Module === module) {
			return Immut.produce(state, (draft) => {
				draft.mountPreviews.delete(Configs.RootPreviewKey);
			});
		}
		return MountStory(state, module);
	},
	//---[MOUNT DATA]---//
	shiftOrderBefore: (state, key: string) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		const after = entry.Order - 1;
		const before = after - 1;
		const ordered = GetOrderedEntryMap(state.mountPreviews);
		ordered[after] = ordered[before];
		ordered[before] = entry;

		return {
			...state,
			mountPreviews: FromOrderedEntryMap(ordered),
		};
	},
	shiftOrderAfter: (state, key: string) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		const before = entry.Order - 1;
		const after = before + 1;
		const ordered = GetOrderedEntryMap(state.mountPreviews);
		ordered[before] = ordered[after];
		ordered[after] = entry;

		return {
			...state,
			mountPreviews: FromOrderedEntryMap(ordered),
		};
	},
	setMountData: (state, key: string, data: Partial<PreviewEntry>) => {
		const oldData = state.mountPreviews.get(key);
		if (!oldData) return state;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, {
				...oldData,
				...data,
			});
		});
	},
	updateMountData: (state, key: string, updater: (current: PreviewEntry) => PreviewEntry) => {
		const current = state.mountPreviews.get(key);
		if (!current) return state;

		const updatedData = updater(current);
		if (updatedData === current) return state;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, updatedData);
		});
	},
	setActionComponents: (state, key: string, components: Map<string, ActionTabEntry>) => {
		const entry = state.mountPreviews.get(key);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(key, {
				...entry,
				ActionComponents: components,
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
	},
});
