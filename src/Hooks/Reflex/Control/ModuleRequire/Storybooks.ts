import { useStorybookList } from "Hooks/Reflex/Use/Modules";
import { CheckBookReturn } from "./Utils";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useCallback, useEffect, useState } from "@rbxts/react";
import { StorybookLoader } from "./StorybookLoader";
import { selectRecomputeStorybooksKey } from "Reflex/Interface";

//Hot-Reloads (requires) all the storybooks
export function controlStorybooks() {
	const recomputeKey = useSelector(selectRecomputeStorybooksKey);
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

	useEffect(() => {
		if (!storybookLoaders) return;
		storybookLoaders.forEach((loader) => {
			const hotReloader = loader.HotReloader;
			if (!hotReloader) return;
			hotReloader.Reload();
		});
	}, [recomputeKey]);

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
}
