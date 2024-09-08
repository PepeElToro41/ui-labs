import { Signal } from "@rbxts/lemon-signal";
import MountingMap, { Mounter } from "./Mounters";
import React from "@rbxts/react";

export function MountStory<T extends MountType>(
	mountType: T,
	entry: PreviewEntry,
	result: MountResults[T],
	frame: Frame,
	unmountSignal: Signal,
) {
	const Mounter = MountingMap[mountType] as Mounter<T>;
	const renderer = <Mounter Result={result} MountFrame={frame} Entry={entry} UnmountSignal={unmountSignal} />;

	return renderer;
}
