import { useStorybookList } from "Hooks/Reflex/Use/Modules";
import { HotReloader } from "Utils/HotReloader";
import { CheckBookReturn } from "./Utils";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { Dictionary } from "@rbxts/sift";
import { selectStorybooks } from "Reflex/ModuleRequire/Storybook";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useEffect } from "@rbxts/react";

//Hot-Reloads (requires) all the storybooks
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
	}, [storybookList]);
}
