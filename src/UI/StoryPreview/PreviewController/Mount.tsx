import { Signal } from "@rbxts/lemon-signal";
import React from "@rbxts/react";
import { RecoverControlsData } from ".";
import MountingMap, { Mounter } from "./Mounters";

export function MountStory<T extends MountType>(
	mountType: T,
	entry: PreviewEntry,
	result: MountResults[T],
	frame: Frame,
	listener: Frame,
	unmountSignal: Signal,
	recoverControlsData: RecoverControlsData | undefined,
	setRecoverControlsData: (data?: RecoverControlsData) => void
) {
	const Mounter = MountingMap[mountType] as Mounter<T>;
	const renderer = (
		<Mounter
			Result={result}
			MountFrame={frame}
			ListenerFrame={listener}
			Entry={entry}
			UnmountSignal={unmountSignal}
			RecoverControlsData={recoverControlsData}
			SetRecoverControlsData={setRecoverControlsData}
		/>
	);

	return renderer;
}
