import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";
import { HotReloader, HotReloaderResult } from "Utils/HotReloader";
import { DuplicateMap, ExtensionPredicator } from "Utils/NodeUtils";
import useTreeSearch from "../useTreeSearch";

declare global {
	type StoryBooks = Map<ModuleScript, StoryBookResult>;
	interface StoryBookResult extends UILibsPartial {
		name?: string;
		groupRoots?: boolean;
		storyRoots: Instance[];
	}
}

const CheckBookReturn = (result: unknown): result is StoryBookResult => {
	const newStoryRoots = new Array<Instance>();
	if (!typeIs(result, "table")) return false;
	if ("name" in result) {
		if (!typeIs(result.name, "string")) return false;
	}
	if ("groupRoots" in result) {
		if (!typeIs(result.groupRoots, "boolean")) return false;
	}
	if ("storyRoots" in result) {
		if (!typeIs(result.storyRoots, "table")) return false;
		const roots = result.storyRoots as Array<unknown>;
		for (let index = 0; index < roots.size(); index++) {
			const value = roots[index];
			if (!typeIs(value, "Instance")) continue;
			newStoryRoots.push(value);
		}
		return true;
	} else {
		return false;
	}
};
const Predicator = ExtensionPredicator(Configs.Extensions.StoryBook);

export = (search: (keyof Services)[]) => {
	const [storyBookList] = useTreeSearch("ModuleScript", Predicator, search);
	const [storyBooks, setStoryBooks] = useState<StoryBooks | undefined>(undefined);
	const updateModule = useCallback((module: ModuleScript, result: unknown) => {
		const isStoryReturn = CheckBookReturn(result);
		setStoryBooks((oldMap) => {
			const newMap = (oldMap && DuplicateMap(oldMap)) ?? new Map<ModuleScript, StoryBookResult>();
			if (isStoryReturn) {
				newMap.set(module, result);
			} else {
				newMap.delete(module);
			}
			return newMap;
		});
	}, []);

	useEffect(() => {
		const reloaders = new Array<HotReloader>();
		const newBooksMap: StoryBooks = new Map<ModuleScript, StoryBookResult>();
		storyBookList.forEach((module) => {
			const [sucess, result, reloader] = HotReloader.require<StoryBookResult>(module);
			if (sucess) {
				const isStoryReturn = CheckBookReturn(result);
				if (isStoryReturn) {
					newBooksMap.set(module, result);
				}
			}
			reloader.onReloaded.Connect((newResult) => {
				updateModule(module, (newResult as HotReloaderResult<StoryBookResult>)[1] as StoryBookResult);
			});
			reloaders.push(reloader);
		});
		setStoryBooks(newBooksMap);
		return () => {
			reloaders.forEach((reloader) => {
				reloader.Destroy();
			});
		};
	}, [storyBookList]);

	return $tuple(storyBooks, storyBookList);
};
