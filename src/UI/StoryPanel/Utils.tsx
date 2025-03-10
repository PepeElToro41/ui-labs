import React, { useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview";
import MountEntry from "./StoryTitle/MountEntry";

export function useRenderedMountEntries(scroller?: ScrollingFrame) {
	const mounts = useSelector(selectStoryPreviews);

	const entries = useMemo(() => {
		const elements: ReactChildren = new Map();

		mounts.forEach((entry, key) => {
			elements.set(
				key,
				<MountEntry PreviewEntry={entry} Scroller={scroller} />
			);
		});
		return elements;
	}, [mounts, scroller]);

	return entries;
}
