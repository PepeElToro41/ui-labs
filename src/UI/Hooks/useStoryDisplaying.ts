import { useDebounceEffect, useInterval } from "@rbxts/pretty-roact-hooks";
import { useBinding, useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { IsStoryHandle } from "Declarations/Story";
import { HotReloader, HotReloaderResult } from "Utils/HotReloader";

declare global {
	interface StoryHandle {
		Result: IsStoryHandle | undefined;
		Error: string | undefined;
		Reloader: HotReloader;
	}
}

//Not a good name, this does not displays the story, it just handles the story selection to display (useStoryHandler does the displaying/hotreloading)

export = () => {
	const [displayedNode, setDisplayedNode] = useState<StoryNode | undefined>(undefined);
	const DisplayStoryNode = useCallback((newStoryDisplay: StoryNode) => {
		setDisplayedNode((oldStoryDisplay) => {
			if (oldStoryDisplay && oldStoryDisplay.Module === newStoryDisplay.Module) {
				return undefined;
			} else {
				return newStoryDisplay;
			}
		});
	}, []);
	const UpdateDisplayNode = useCallback((nodes: FolderNode[]) => {
		setDisplayedNode((oldStoryDisplay) => {
			if (!oldStoryDisplay) return undefined;
			const oldModule = oldStoryDisplay.Module;
			let foundNode: StoryNode | undefined = undefined;
			const Iterate = (folder: FolderNode) => {
				for (let index = 0; index < folder.Inside.size(); index++) {
					if (foundNode !== undefined) break;
					const listNode = folder.Inside[index];
					if ("Inside" in listNode) {
						Iterate(listNode);
					} else {
						if (listNode.Module === oldModule) {
							foundNode = listNode;
							break;
						}
					}
				}
			};
			for (let index = 0; index < nodes.size(); index++) {
				const node = nodes[index];
				if (foundNode !== undefined) break;
				Iterate(node);
			}
			return foundNode;
		});
	}, []);

	return $tuple(displayedNode, DisplayStoryNode, UpdateDisplayNode);
};
