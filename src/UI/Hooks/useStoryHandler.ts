import { useAsyncEffect } from "@rbxts/pretty-roact-hooks";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { _StoryExecutor } from "@rbxts/ui-labs";
import { _UILabsInternal as UL, _UILabsControls as ULC } from "@rbxts/ui-labs/out/Internal";
import { HotReloader, HotReloaderResult } from "Utils/HotReloader";
import Signal from "Utils/Signal";

declare global {
	interface StoryHandle {
		NodeBinded: StoryType;
		Result: _StoryExecutor | undefined;
		Error: string | undefined;
		Reloader: HotReloader;
	}
}

export = (displayingNode: StoryType | undefined) => {
	const [storyHandle, setStoryHandle] = useState<StoryHandle>(undefined);

	const StoryHandleSetter = useCallback((ReloaderReturn: HotReloaderResult<_StoryExecutor>, NodeBinded: StoryType) => {
		const [sucess, result, reloader] = ReloaderReturn;
		if (sucess) {
			setStoryHandle({ Result: result as _StoryExecutor, Error: undefined, Reloader: reloader, NodeBinded: NodeBinded });
		} else {
			setStoryHandle({
				Result: undefined,
				Error: reloader.result as string,
				Reloader: reloader,
				NodeBinded: NodeBinded,
			});
		}
	}, []);

	//Forced reload
	const ReloadHandle = useCallback(() => {
		task.spawn(() => {
			if (!storyHandle) return;
			storyHandle.Reloader.Reload<_StoryExecutor>();
		});
	}, [storyHandle]);

	useEffect(() => {
		let reloadConnection: Signal.Connection;
		if (displayingNode && displayingNode.Module.IsA("ModuleScript") && game.IsAncestorOf(displayingNode.Module)) {
			reloadConnection = HotReloader.requireConnect<_StoryExecutor>(displayingNode.Module, (newHandle) => {
				StoryHandleSetter(newHandle as HotReloaderResult<_StoryExecutor>, displayingNode);
			});
		} else {
			if (storyHandle) {
				storyHandle.Reloader.Destroy();
			}
			setStoryHandle(undefined);
		}
		return () => {
			if (reloadConnection) reloadConnection.Disconnect();
		};
	}, [displayingNode]);
	useEffect(() => {
		if (!storyHandle || !storyHandle.Reloader) return;
		const node = storyHandle.NodeBinded;
		const changedConnection = storyHandle.Reloader.onReloaded.Connect((newHandle) => {
			StoryHandleSetter(newHandle as HotReloaderResult<_StoryExecutor>, node);
		});
		return () => {
			changedConnection.Disconnect();
		};
	}, [storyHandle]);

	return $tuple(storyHandle, ReloadHandle);
};
