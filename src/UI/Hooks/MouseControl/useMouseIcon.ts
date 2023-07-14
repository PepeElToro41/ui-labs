import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { Filter } from "Utils/TableUtil";

const MouseIcons = {
	Select: "rbxasset://SystemCursors/PointingHand",
	ResizeAll: "rbxasset://SystemCursors/SizeNESW",
	ResizeV: "rbxasset://SystemCursors/SizeNS",
	ResizeH: "rbxasset://SystemCursors/SizeEW",
	Move: "rbxasset://SystemCursors/SizeAll",
	Cross: "rbxasset://SystemCursors/Cross",
};

declare global {
	type MouseIcon = keyof typeof MouseIcons;
}

export = (pluginObject?: typeof plugin) => {
	const [iconList, setIconList] = useState<[string, MouseIcon][]>([]);
	const [mouseIcon, setMouseIcon] = useState<string | undefined>(undefined);
	const SetIcon = useCallback(
		(index: string, icon: MouseIcon) => {
			const newIconList = table.clone(iconList);
			const oldIcon = newIconList.find((icon) => icon[0] === index);
			if (oldIcon) {
				oldIcon[1] = icon;
			} else {
				newIconList.insert(0, [index, icon]);
			}
			setIconList(newIconList);
		},
		[iconList],
	);
	const UnsetIcon = useCallback(
		(index: string) => {
			const newIconList = Filter(iconList, (icon) => icon[0] !== index);
			setIconList(newIconList);
		},
		[iconList],
	);
	useEffect(() => {
		if (!pluginObject) return;
		const iconSelected = iconList[0];

		setMouseIcon(iconSelected && MouseIcons[iconSelected[1]]);
	}, [iconList]);
	useEffect(() => {
		if (!pluginObject) return;
		pluginObject.GetMouse().Icon = mouseIcon ?? "";
	}, [mouseIcon]);
	return $tuple(SetIcon, UnsetIcon);
};
