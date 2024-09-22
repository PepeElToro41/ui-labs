import Configs from "Constants/Configs";
import { useInstanceSearch } from "./InstanceSearch";
import { ExtensionPredicator } from "./Utils";
import Vide, { ProviderChildren, Source } from "@rbxts/vide";

interface ModuleSearchContext {
	Stories: Source<ModuleScript[]>;
	Storybooks: Source<ModuleScript[]>;
}

const ModuleSearchContext = Vide.create_context({} as ModuleSearchContext);

// This provider searches for modulescripts in the hierarchy and provides them in a list
function ModuleSearchProvider(props: ProviderChildren) {
	const [stories] = useInstanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Story));
	const [storybooks] = useInstanceSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Storybook));

	const context: ModuleSearchContext = {
		Stories: stories,
		Storybooks: storybooks,
	};

	return ModuleSearchContext.provide(context, props.children);
}

export function useModuleList() {
	const context = ModuleSearchContext.consume();
	return context;
}
export function useStoryModules() {
	const context = ModuleSearchContext.consume();
	return context.Stories;
}
export function useStorybookModules() {
	const context = ModuleSearchContext.consume();
	return context.Storybooks;
}

export default ModuleSearchProvider;
