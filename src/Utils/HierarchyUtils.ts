import Configs from "Plugin/Configs";

export function IsStoryBook(instance: Instance) {
	if (!instance.IsA("ModuleScript")) return false;
	return instance.Name.match("%" + Configs.Extensions.StoryBook + "$")[0] !== undefined;
}

export function StoryBookPredicator(instance: Instance) {
	const [sucess] = pcall(() => {
		return instance.Name;
	});
	return sucess && instance.Parent !== undefined && IsStoryBook(instance);
}
