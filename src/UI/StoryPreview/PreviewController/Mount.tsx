import { Signal } from "@rbxts/lemon-signal";
import MountingMap, { Mounter } from "./Mounters";
import React from "@rbxts/react";
import { RecoverControlsData } from ".";

export function MountStory<T extends MountType>(
	mountType: T,
	entry: PreviewEntry,
	result: MountResults[T],
	frame: Frame,
	unmountSignal: Signal,
	recoverControlsData: RecoverControlsData | undefined,
	setRecoverControlsData: (data?: RecoverControlsData) => void,
) {
	const Mounter = MountingMap[mountType] as Mounter<T>;
	const renderer = (
		<Mounter
			Result={result}
			MountFrame={frame}
			Entry={entry}
			UnmountSignal={unmountSignal}
			RecoverControlsData={recoverControlsData}
			SetRecoverControlsData={setRecoverControlsData}
		/>
	);

	return renderer;
}
