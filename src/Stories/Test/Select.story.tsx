import { StarterGui } from "@rbxts/services";

export = (target: Frame) => {
	const template = StarterGui.WaitForChild("Test")!
		.WaitForChild("CatalogApp")
		.Clone() as Frame;

	template.Parent = target;

	return () => {
		template.Destroy();
	};
};
