export function FixColor3(color: Color3) {
	const fixedColor = new Color3(math.clamp(color.R, 0, 1), math.clamp(color.G, 0, 1), math.clamp(color.B, 0, 1));
	return fixedColor;
}

export function GetColorHex(color: Color3) {
	const [sucess, hex] = pcall(() => color.ToHex());
	if (!sucess) return "FFFFFF";
	return hex;
}

export function IsLocalPlugin(gotPlugin: Plugin) {
	if (gotPlugin === undefined) return true;
	return gotPlugin.Name.find(".rbxm")[0] !== undefined;
}
