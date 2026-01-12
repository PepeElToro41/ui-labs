import React from "@rbxts/react";

import Editor from "./Preview/Editor";
import Viewport from "./Preview/Viewport";
import Widget from "./Preview/Widget";

declare global {
	type HolderType = keyof typeof StoryHoldersMap;
	interface StoryHolderProps {
		PreviewEntry: PreviewEntry;
		MountFrame: Frame;
		ListenerFrame: Frame;
		MountType?: MountType;
		SetCanReload: (canReload: boolean) => void;
	}
}

type HolderComponent = (props: StoryHolderProps) => React.Element;
type SetHolder = (holderType: HolderType, holder: Frame) => void;

export const StoryHoldersMap = {
	Widget: Widget,
	Editor: Editor,
	Viewport: Viewport
} satisfies Record<string, HolderComponent>;

export function CreateHolder(
	holderType: HolderType,
	entry: PreviewEntry,
	mountType: MountType | undefined,
	mountFrame: Frame,
	listenerFrame: Frame,
	setCanReload: (canReload: boolean) => void
) {
	const HolderFactory = StoryHoldersMap[holderType];

	return (
		<HolderFactory
			PreviewEntry={entry}
			MountType={mountType}
			MountFrame={mountFrame}
			ListenerFrame={listenerFrame}
			SetCanReload={setCanReload}
		/>
	);
}
