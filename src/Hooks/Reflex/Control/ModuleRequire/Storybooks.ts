import { useEffect } from "@rbxts/roact-hooked";
import { useStorybookList } from "Hooks/Reflex/Use/Modules";
import { HotReloader } from "Utils/HotReloaded";
import { CheckBookReturn } from "./Utils";
import { useProducer, useSelector } from "@rbxts/roact-reflex";
import { Dictionary } from "@rbxts/sift";
import { selectStorybooks } from "Reflex/ModuleRequire/Storybook";
import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";

export function controlStorybooks() {
	const storybookList = useStorybookList();
	const storybooks = useSelector(selectStorybooks).storybooks;
	const { setStorybooks } = useProducer<RootProducer>();

	const UpdateModule = (module: ModuleScript, result: unknown) => {
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

		storybookList.forEach((storybook) => {
			const [promise, reloader] = HotReloader.require(storybook);
			reloader.OnReloaded.Connect((newResult) => {
				UpdateModule(storybook, newResult);
			});
			reloaders.push(reloader);
			requirePromises.push(
				promise.then((reloadResult) => {
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
			requirePromises.forEach((promise) => {
				promise.cancel();
			});
			reloaders.forEach((reloader) => {
				reloader.Destroy();
			});
		};
	}, [storybookList]);
}
