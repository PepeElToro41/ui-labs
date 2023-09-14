//This hooks search in the game hierarchy for Stories and returns a list of them (Updates when a new story is added or removed)

import Configs from "Plugin/Configs";
import { useSettingsContext } from "UI/Contexts/SettingsContext";
import { ExtensionPredicator } from "Utils/NodeUtils";
import useTreeSearch from "../useTreeSearch";
export = (search: (keyof Services)[]) => {
	const [storyList] = useTreeSearch("ModuleScript", ExtensionPredicator(Configs.Extensions.Story), search);
	return $tuple(storyList);
};
