import Immut from "@rbxts/immut";
import { createProducer } from "@rbxts/reflex";
import Roact from "@rbxts/roact";
import { HttpService } from "@rbxts/services";
import { Dictionary } from "@rbxts/sift";
import { RootUID } from "Plugin/Configs";
import { type HotReloader } from "Utils/HotReloader";

declare global {
	interface PanelComponents {
		Controls: Roact.Element;
		Actions: Roact.Element;
		Summary: string;
	}
	interface PreviewEntry {
		UID: string;
		Module: ModuleScript;
		HotReloader?: HotReloader;
		Holder?: Frame;

		OnWidget: boolean;
		Zoom: number;
		Offset: Vector2;
		Order: number;

		PanelComponents?: Partial<PanelComponents>;
	}
}
const DefaultEntry = {
	Zoom: 1,
	Offset: Vector2.zero,
	OnWidget: false,
} as const;

interface StoryMountState {
	mountPreviews: Map<string, PreviewEntry>;
	mountFrame?: Frame;
}

const initialState: StoryMountState = {
	mountPreviews: new Map(),
	mountFrame: undefined,
};

export const selectStoryMount = (state: RootState) => state.storyPreview.mount;
export const selectStoryPreviews = (state: RootState) => state.storyPreview.mount.mountPreviews;
export const selectPreview = (uid: string) => (state: RootState) => selectStoryPreviews(state).get(uid);
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
	const uid = HttpService.GenerateGUID();
	const newEntry: PreviewEntry = {
		...DefaultEntry,
		UID: uid,
		Module: module,
		Order: order,
	};
	return newEntry;
}

function MountStory(state: StoryMountState, module: ModuleScript) {
	const rootStory = state.mountPreviews.get(RootUID);
	const listSize = rootStory ? rootStory.Order : state.mountPreviews.size() + 1;
	const entry = CreateNewEntry(module, listSize);
	entry.UID = RootUID;
	return Immut.produce(state, (draft) => {
		draft.mountPreviews.set(RootUID, entry);
	});
}

//This saves all the stories that are mounted (Only references to nodes and modules)
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
	mountOnViewport: (state, module: ModuleScript) => {
		const listSize = state.mountPreviews.size() + 1;
		const entry = CreateNewEntry(module, listSize);
		entry.OnWidget = true;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(entry.UID, entry);
		});
	},
	unmountStory: (state, uid = RootUID) => {
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.delete(uid);
		});
	},
	unmountByModule: (state, module: ModuleScript) => {
		return Immut.produce(state, (draft) => {
			state.mountPreviews.forEach((entry, key) => {
				if (entry.Module === module) {
					draft.mountPreviews.delete(key);
				}
			});
		});
	},
	toggleMount: (state, module: ModuleScript) => {
		const rootStory = state.mountPreviews.get(RootUID);
		if (rootStory && rootStory.Module === module) {
			return Immut.produce(state, (draft) => {
				draft.mountPreviews.delete(RootUID);
			});
		}
		return MountStory(state, module);
	},
	//---[MOUNT DATA]---//
	setMountOrderBefore: (state, uid: string, before: string) => {
		const previews = state.mountPreviews;
		const entry = previews.get(uid);
		const beforeEntry = previews.get(before);
		if (!entry || !beforeEntry) return state;

		return Immut.produce(state, (draft) => {
			const draftPreviews = draft.mountPreviews;
			//Shifting Backwards (Removed)
			previews.forEach((value, index) => {
				if (index === uid) return;
				if (value.Order > entry!.Order) {
					draftPreviews.get(index)!.Order -= 1;
				}
			});
			const beforeOrder = draft.mountPreviews.get(before)!.Order;
			draftPreviews.get(uid)!.Order = beforeOrder;
			//Shfiting Forwards (Inserted)
			previews.forEach((value, index) => {
				if (index === uid) return;
				if (value.Order >= beforeOrder) {
					draftPreviews.get(index)!.Order += 1;
				}
			});
		});
	},
	setMountData: (state, uid: string, data: Partial<PreviewEntry>) => {
		const oldData = state.mountPreviews.get(uid);
		if (!oldData) return state;
		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(uid, {
				...oldData,
				...data,
			});
		});
	},
	//---[MOUNT RENDER]---//
	setMountFrame: (state, mountFrame?: Frame) => {
		if (state.mountFrame === mountFrame) return state;
		return { ...state, mountFrame };
	},
	setPanelComponents: (state, uid: string, components: Partial<PanelComponents>) => {
		const entry = state.mountPreviews.get(uid);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(uid, {
				...entry,
				PanelComponents: components,
			});
		});
	},
	unsetPanelComponents: (state, uid: string) => {
		const entry = state.mountPreviews.get(uid);
		if (!entry) return state;

		return Immut.produce(state, (draft) => {
			draft.mountPreviews.set(uid, {
				...entry,
				PanelComponents: undefined,
			});
		});
	},
});
