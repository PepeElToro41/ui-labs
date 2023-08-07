const Dark = {
	PureColor: {
		Color: Color3.fromRGB(36, 36, 36),
		Inverse: new Color3(1, 1, 1),
	},
	Text: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(150, 150, 150),
	},
	Icon: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(105, 105, 105),
	},
	Divisor: {
		Color: Color3.fromRGB(150, 150, 150),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(33, 33, 56),
		Logo: Color3.fromRGB(242, 210, 255),
	},
	Search: {
		Color: Color3.fromRGB(49, 49, 53),
		Placeholder: Color3.fromRGB(161, 161, 161),
		Stroke: Color3.fromRGB(150, 150, 150),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(24, 24, 24),
	StoryPanel: {
		Color: Color3.fromRGB(34, 34, 34),
		PatternColor: Color3.fromRGB(255, 255, 255),
		PatternTransparency: 0.95,
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(56, 56, 56),
	},
};

const Light: Theme = {
	PureColor: {
		Color: new Color3(1, 1, 1),
		Inverse: Color3.fromRGB(33, 33, 56),
	},
	Text: {
		Color: Color3.fromRGB(38, 38, 38),
		Disabled: Color3.fromRGB(92, 92, 92),
	},
	Icon: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(105, 105, 105),
	},
	Divisor: {
		Color: Color3.fromRGB(0, 0, 0),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(38, 33, 74),
		Logo: Color3.fromRGB(242, 210, 255),
	},
	Search: {
		Color: Color3.fromRGB(156, 156, 161),
		Placeholder: Color3.fromRGB(94, 94, 94),
		Stroke: Color3.fromRGB(0, 0, 0),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(212, 212, 212),
	StoryPanel: {
		Color: Color3.fromRGB(183, 183, 183),
		PatternColor: Color3.fromRGB(0, 0, 0),
		PatternTransparency: 0.93,
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(64, 64, 64),
	},
};

const Themes = {
	Default: Dark as Theme,
	Dark: Dark as Theme,
	Light: Light,
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}
declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

export = Themes;
