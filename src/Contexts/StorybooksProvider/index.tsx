import { Storybook } from "@rbxts/ui-labs";
import Vide, { cleanup, effect, ProviderChildren, Source, source, untrack, values } from "@rbxts/vide";
import { StorybookLoader } from "./StorybookLoader";
import { useStorybookModules } from "Contexts/ModuleSearchProvider";
import { CheckBookReturn } from "./Utils";

declare global {
	type Storybooks = Map<ModuleScript, Storybook>;
}

type StorybooksContext = Source<Storybooks>;
const StorybooksContext = Vide.create_context<StorybooksContext>(undefined!);

// This provider hot reloads storybooks and provides the results in a list
function StorybooksProvider(props: ProviderChildren) {
	const storybooks = source<Storybooks>(new Map());

	const storybookModules = useStorybookModules();

	const storybookLoaders = values(storybookModules, (module) => {
		const loader = new StorybookLoader(module);
		loader.Init();

		cleanup(loader);
		return loader;
	});

	// getting the results
	function CollapseStorybookResults() {
		const results: Storybooks = new Map();
		storybookLoaders().forEach((loader) => {
			const result = loader.GetCurrentResult();
			if (result === undefined) return;
			if (!CheckBookReturn(result)) return;
			results.set(loader.Module, result);
		});
		storybooks(results);
	}
	// connecting loaders
	effect(() => {
		const connections: RBXScriptConnection[] = [];
		storybookLoaders().forEach((loader) => {
			const connection = loader.OnStorybookUpdated.Connect(() => {
				untrack(CollapseStorybookResults);
			});
			connections.push(connection);
		});

		untrack(CollapseStorybookResults);

		cleanup(() => {
			connections.forEach((connection) => {
				connection.Disconnect();
			});
		});
	});

	return StorybooksContext.provide(storybooks, props.children);
}

export function useStorybooks() {
	return StorybooksContext.consume();
}

export default StorybooksProvider;
