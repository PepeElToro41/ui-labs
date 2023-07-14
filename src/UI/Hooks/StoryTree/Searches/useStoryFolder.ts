import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import { useSettingsContext } from "UI/Contexts/SettingsContext";
import { HotReloader, HotReloaderResult } from "Utils/HotReloader";
import { DuplicateMap, ExtensionPredicator } from "Utils/NodeUtils";
import useTreeSearch from "../useTreeSearch";

declare global {
	type StoryFolders = Map<ModuleScript, StoryFolderResult>;
	interface StoryFolderResult {
		DisplayName: string;
		Inside: ModuleScript[];
	}
}

export = (search: (keyof Services)[]) => {
	const [storyFolderList] = useTreeSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.StoryFolder), search);
	const [storyFolders, setStoryFolders] = useState<StoryFolders>(new Map<ModuleScript, StoryFolderResult>());

	const CreateFolder = useCallback((Node: FolderNode) => {}, []);
	const updateModule = useCallback((module: ModuleScript, result: StoryFolderResult) => {
		setStoryFolders((oldMap) => {
			const newMap = DuplicateMap(oldMap);
			newMap.set(module, result);
			return newMap;
		});
	}, []);
	useEffect(() => {
		const reloaders = new Array<HotReloader>();
		storyFolderList.forEach((module) => {
			const [_, result, reloader] = HotReloader.require<StoryFolderResult>(module);
			updateModule(module, result as StoryFolderResult);
			reloader.onReloaded.Connect((newResult) => {
				updateModule(module, (newResult as HotReloaderResult<StoryFolderResult>)[1] as StoryFolderResult);
			});
			reloaders.push(reloader);
		});
		return () => {
			reloaders.forEach((reloader) => {
				reloader.Destroy();
			});
		};
	}, [storyFolderList]);

	useEffect(() => {}, [storyFolders]);

	return $tuple(storyFolders, CreateFolder);
};
