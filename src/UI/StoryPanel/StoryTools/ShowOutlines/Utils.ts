import { CreateTuple } from "Utils/MiscUtils";

function GetFirstHolder(children: Instance, root: Instance) {
	let parent: Instance = children;

	while (parent.Parent) {
		const childrenParent = parent.Parent;
		if (!childrenParent) break;
		if (childrenParent === root) break;

		parent = childrenParent;
		if (childrenParent.IsA("GuiObject")) {
			break;
		}
	}
	if (parent) {
		if (parent.IsA("GuiObject")) {
			return parent;
		}
	}
	return undefined;
}

export const MIN_SIZE = 2;

export function IsComponentFullscreen(component: GuiObject, holder: GuiObject) {
	const holderSize = holder.AbsoluteSize;
	const sizeDifference = component.AbsoluteSize.sub(holderSize);
	const positionDifference = component.AbsolutePosition.sub(holder.AbsolutePosition);

	if (math.floor(sizeDifference.Magnitude) > 0) return false;
	if (math.floor(positionDifference.Magnitude) > 0) return false;
	return true;
}

export function IsOutlineWorthShow(component: GuiObject, root: Instance) {
	if (component.BackgroundTransparency < 0.95) return false; // component is already visible
	if (component.AbsoluteSize.X < MIN_SIZE || component.AbsoluteSize.Y < MIN_SIZE) return false; // component is too small

	const holder = GetFirstHolder(component, root);
	if (!holder) return true;
	const isFullscreen = IsComponentFullscreen(component, holder); //component has the same position and size as the holder
	return !isFullscreen;
}

export function GetOutlinedComponents(root: Instance) {
	const components: GuiObject[] = [];
	const omited: GuiObject[] = [];

	const visit = (instance: Instance) => {
		if (instance !== root && instance.IsA("GuiObject")) {
			if (!instance.Visible) {
				omited.push(instance);
				return;
			}
			if (IsOutlineWorthShow(instance, root)) {
				components.push(instance);
			} else {
				omited.push(instance);
			}
		}
		for (const child of instance.GetChildren()) {
			visit(child);
		}
	};

	visit(root);
	return CreateTuple(components, omited);
}
