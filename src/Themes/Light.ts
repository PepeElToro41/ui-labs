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
		Color: Color3.fromRGB(31, 31, 31),
		Disabled: Color3.fromRGB(94, 94, 94),
	},
	Divisor: {
		Color: Color3.fromRGB(0, 0, 0),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(163, 133, 235),
		Logo: Color3.fromRGB(54, 28, 64),
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
			Color: Color3.fromRGB(128, 128, 128),
			Disabled: Color3.fromRGB(171, 171, 171),
			StoryIcon: {
				Color: Color3.fromRGB(56, 135, 255),
				Disabled: Color3.fromRGB(71, 107, 140),
			},
			FolderIcon: {
				Color: Color3.fromRGB(176, 97, 224),
				Disabled: Color3.fromRGB(191, 148, 217),
			},
			Book: Color3.fromRGB(0, 199, 115),
		},
		StorySelected: {
			Color: Color3.fromRGB(79, 199, 255),
			Disabled: Color3.fromRGB(150, 212, 252),
			Text: {
				Color: Color3.fromRGB(41, 51, 61),
				Disabled: Color3.fromRGB(97, 115, 130),
			},
			StoryIcon: {
				Color: Color3.fromRGB(48, 64, 79),
				Disabled: Color3.fromRGB(79, 99, 120),
			},
		},
	},
	StoryTitle: {
		Color: Color3.fromRGB(250, 250, 250),
		Path: {
			Underline: Color3.fromRGB(120, 190, 120),
			PathText: Color3.fromRGB(120, 190, 120),
			ButtonColor: Color3.fromRGB(89, 89, 99),
		},
	},
};

export = Light;
