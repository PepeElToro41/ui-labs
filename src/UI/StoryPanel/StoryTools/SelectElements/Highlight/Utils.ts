import { IsComponentFullscreen } from "../../ShowOutlines/Utils";

export function GetNonFullscreenParent(component: GuiObject, root: Instance) {
	let parent: Instance = component;

	while (parent) {
		const childrenParent = parent.Parent;
		if (!childrenParent) break;

		parent = childrenParent;
		if (parent.IsA("GuiObject")) {
			if (!IsComponentFullscreen(parent, component)) {
				return parent;
			}
		}
	}

	return undefined;
}
