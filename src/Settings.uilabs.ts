import Roact from "@rbxts/roact";
import { SearchServices } from "Plugin/Configs";

export = identity<UILabsSettings>({
	roact: Roact,
	ServiceSearch: ["ServerScriptService", "ReplicatedStorage", "ServerStorage"],
	HotReloadIgnore: [],
});
