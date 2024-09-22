import Vide, { derive, ProviderChildren, Source } from "@rbxts/vide";
import { useStoryModules } from "Contexts/ModuleSearchProvider";
import { useStorybooks } from "Contexts/StorybooksProvider";
import { GenerateNodes } from "./Utils";

interface StoryNodesContext {
	Nodes: RootNodes;
	Lookup: ModuleLookup;
}

const StoryNodesContext = Vide.create_context<Source<StoryNodesContext>>(undefined!);

// This provider generates the story nodes from the story modules and storybooks
function StoryNodesProvider(props: ProviderChildren) {
	const storyModules = useStoryModules();
	const storybooks = useStorybooks();

	const context = derive(() => {
		const mutableModules = table.clone(storyModules());
		const info = GenerateNodes(mutableModules, storybooks());
		return {
			Nodes: info.nodes,
			Lookup: info.lookup,
		} as StoryNodesContext;
	});

	return StoryNodesContext.provide(context, props.children);
}

export function useStoryNodes() {
	const context = StoryNodesContext.consume();
	return () => context().Nodes;
}
export function useStoryLookup() {
	const context = StoryNodesContext.consume();
	return () => context().Lookup;
}

export default StoryNodesProvider;
