const LightMono: Theme = {
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
		Color: Color3.fromRGB(128, 128, 128),
		Logo: Color3.fromRGB(31, 31, 31),
	},
	Search: {
		Color: Color3.fromRGB(135, 135, 135),
		Placeholder: Color3.fromRGB(77, 77, 77),
		Stroke: Color3.fromRGB(0, 0, 0),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(168, 168, 168),
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
			Color: Color3.fromRGB(105, 105, 105),
			Disabled: Color3.fromRGB(138, 138, 138),
			StoryIcon: {
				Color: Color3.fromRGB(84, 84, 84),
				Disabled: Color3.fromRGB(107, 107, 107),
			},
			FolderIcon: {
				Color: Color3.fromRGB(255, 255, 255),
				Disabled: Color3.fromRGB(212, 212, 212),
			},
			Book: Color3.fromRGB(15, 15, 15),
		},
		StorySelected: {
			Color: Color3.fromRGB(13, 13, 13),
			Disabled: Color3.fromRGB(69, 69, 69),
			Text: {
				Color: Color3.fromRGB(255, 255, 255),
				Disabled: Color3.fromRGB(194, 194, 194),
			},
			StoryIcon: {
				Color: Color3.fromRGB(255, 255, 255),
				Disabled: Color3.fromRGB(189, 189, 189),
			},
		},
	},
	StoryTitle: {
		Color: Color3.fromRGB(250, 250, 250),
		Path: {
			Underline: Color3.fromRGB(59, 59, 59),
			PathText: Color3.fromRGB(48, 48, 48),
			ButtonColor: Color3.fromRGB(120, 120, 120),
		},
	},
};

export = LightMono;
