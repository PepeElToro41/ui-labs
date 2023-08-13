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
	Nodes: {
		Normal: {
			Color: Color3.fromRGB(82, 82, 92),
			Disabled: Color3.fromRGB(54, 54, 59),
			StoryIcon: {
				Color: Color3.fromRGB(115, 179, 237),
				Disabled: Color3.fromRGB(71, 107, 140),
			},
			FolderIcon: {
				Color: Color3.fromRGB(196, 135, 232),
				Disabled: Color3.fromRGB(122, 84, 145),
			},
			Book: Color3.fromRGB(48, 222, 156),
		},
		StorySelected: {
			Color: Color3.fromRGB(39, 141, 209),
			Disabled: Color3.fromRGB(39, 141, 209),
			Text: {
				Color: Color3.fromRGB(27, 37, 48),
				Disabled: Color3.fromRGB(23, 28, 33),
			},
			StoryIcon: {
				Color: Color3.fromRGB(31, 48, 66),
				Disabled: Color3.fromRGB(28, 36, 46),
			},
		},
	},
};

export = Light;
