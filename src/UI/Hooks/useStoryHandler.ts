import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { IsStoryHandle } from "Declarations/Story";
import { HotReloader, HotReloaderResult } from "Utils/HotReloader";

export = (displayingNode: StoryNode | undefined) => {
	const [storyHandle, setStoryHandle] = useState<StoryHandle>(undefined);
	const StoryHandleSetter = useCallback((ReloaderReturn: HotReloaderResult<IsStoryHandle>) => {
		const [sucess, result, reloader] = ReloaderReturn;
		if (sucess) {
			setStoryHandle({ Result: result as IsStoryHandle, Error: undefined, Reloader: reloader });
		} else {
			setStoryHandle({ Result: undefined, Error: reloader.result as string, Reloader: reloader });
		}
	}, []);
	useEffect(() => {
		let handle: HotReloaderResult<IsStoryHandle>;
		if (displayingNode && displayingNode.Module.IsA("ModuleScript") && game.IsAncestorOf(displayingNode.Module)) {
			handle = HotReloader.require<IsStoryHandle>(displayingNode.Module);
			StoryHandleSetter(handle);
		} else {
			setStoryHandle(undefined);
		}
		return () => {
			if (handle) {
				const [_, __, reloader] = handle;
				print("DESTROYING Reloader", reloader);
				reloader.Destroy();
			}
		};
	}, [displayingNode]);
	useEffect(() => {
		if (!storyHandle || !storyHandle.Reloader) return;
		const changedConnection = storyHandle.Reloader.onReloaded.Connect((newHandle) => {
			StoryHandleSetter(newHandle as HotReloaderResult<IsStoryHandle>);
		});
		return () => {
			changedConnection.Disconnect();
		};
	}, [storyHandle]);

	return $tuple(storyHandle);
};
