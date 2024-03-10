import { useStorybookList } from "Hooks/Reflex/Use/Modules";
import { HotReloader } from "Utils/HotReloader";
import { CheckBookReturn } from "./Utils";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { Dictionary } from "@rbxts/sift";
import { selectStorybooks } from "Reflex/ModuleRequire/Storybook";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useCallback, useEffect, useState } from "@rbxts/react";
import { StorybookLoader } from "./StorybookLoader";

//Hot-Reloads (requires) all the storybooks
export function controlStorybooks() {
	const [storybookLoaders, setStorybookLoaders] = useState<Map<ModuleScript, StorybookLoader>>();

	const storybookList = useStorybookList();
	const { setStorybooks } = useProducer<RootProducer>();

	//Checking for Storybook Loader Results
	const CollapseStorybookResults = useCallback(() => {
		const results: Storybooks = new Map();
		if (!storybookLoaders) {
			return setStorybooks(results);
		}

		storybookLoaders.forEach((loader, module) => {
			const result = loader.GetCurrentResult();
			if (result === undefined) return;
			if (!CheckBookReturn(result)) return;

			results.set(module, result);
		});

		setStorybooks(results);
	}, [storybookLoaders]);

	//Creating Storybook Loaders
	useEffect(() => {
		setStorybookLoaders((oldLoaders) => {
			const loaders = new Map<ModuleScript, StorybookLoader>();

			storybookList.forEach((module) => {
				const currentLoader = oldLoaders ? oldLoaders.get(module) : undefined;
				if (currentLoader) loaders.set(module, currentLoader);

				const newLoader = new StorybookLoader(module);
				loaders.set(module, newLoader);
				newLoader.Init();
			});
			if (oldLoaders) {
				oldLoaders.forEach((loader, module) => {
					if (!loaders.has(module)) {
						loader.Destroy();
					}
				});
			}

			return loaders;
		});
	}, [storybookList]);

	//Listening for Storybook Loaders
	useEffect(() => {
		if (!storybookLoaders) return;
		CollapseStorybookResults();

		const connections: RBXScriptConnection[] = [];
		storybookLoaders.forEach((loader) => {
			const connection = loader.OnStorybookUpdated.Connect(() => {
				CollapseStorybookResults();
			});
			connections.push(connection);
		});

		return () => {
			connections.forEach((connection) => {
				connection.Disconnect();
			});
		};
	}, [storybookLoaders, CollapseStorybookResults]);

	/*const UpdateModule = (module: ModuleScript, result: unknown) => {
		const isStorybook = CheckBookReturn(result);
		const newMap = Dictionary.copy(storybooks);
		if (isStorybook) {
			newMap.set(module, result);
		} else {
			newMap.delete(module);
		}
		setStorybooks(newMap);
	};

	useEffect(() => {
		const reloaders: HotReloader[] = [];
		const requirePromises: Promise<unknown>[] = [];
		const storybooksMap = new Map<ModuleScript, StorybookResult>();
		const connections: RBXScriptConnection[] = [];

		storybookList.forEach((storybook) => {
			const reloadResult = HotReloader.require(storybook);
			const connection = reloadResult.Reloader.OnReloaded.Connect((newResult) => {
				UpdateModule(storybook, newResult);
			});
			connections.push(connection);
			reloaders.push(reloadResult.Reloader);
			requirePromises.push(
				reloadResult.Result.then((reloadResult) => {
					if (!reloadResult.Sucess) return;
					if (!CheckBookReturn(reloadResult.Result)) return;
					storybooksMap.set(storybook, reloadResult.Result);
				}),
			);
		});
		const setPromise = Promise.allSettled(requirePromises).then(() => {
			setStorybooks(storybooksMap);
		});

		return () => {
			setPromise.cancel();
			connections.forEach((connection) => connection.Disconnect());
			requirePromises.forEach((promise) => promise.cancel());
			reloaders.forEach((reloader) => reloader.Destroy());
		};
	}, [storybookList]);*/
}
