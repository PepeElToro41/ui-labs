const DarkRed: Theme = {
	PureColor: {
		Color: new Color3(1, 1, 1),
		Inverse: Color3.fromRGB(33, 33, 56),
	},
	Text: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(97, 117, 145),
	},
	Icon: {
		Color: Color3.fromRGB(247, 247, 247),
		Disabled: Color3.fromRGB(156, 156, 156),
	},
	Divisor: {
		Color: Color3.fromRGB(254, 66, 66),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(166, 74, 87),
		Logo: Color3.fromRGB(255, 196, 196),
	},
	Search: {
		Color: Color3.fromRGB(9, 26, 42),
		Placeholder: Color3.fromRGB(75, 85, 99),
		Stroke: Color3.fromRGB(222, 79, 79),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(21, 37, 59),
	StoryPanel: {
		Color: Color3.fromRGB(31, 41, 55),
		PatternColor: Color3.fromRGB(17, 24, 39),
		PatternTransparency: 0.85,
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(64, 64, 64),
	},
	StoryTitle: {
		Color: Color3.fromRGB(28, 38, 48),
		Path: {
			Underline: Color3.fromRGB(234, 169, 123),
			PathText: Color3.fromRGB(234, 169, 123),
			ButtonColor: Color3.fromRGB(89, 89, 99),
		},
	},
	Nodes: {
		Normal: {
			Color: Color3.fromRGB(54, 77, 102),
			Disabled: Color3.fromRGB(38, 64, 89),
			StoryIcon: {
				Color: Color3.fromRGB(71, 138, 181),
				Disabled: Color3.fromRGB(66, 97, 117),
			},
			FolderIcon: {
				Color: Color3.fromRGB(252, 143, 143),
				Disabled: Color3.fromRGB(145, 105, 105),
			},
			Book: Color3.fromRGB(61, 255, 207),
		},
		StorySelected: {
			Color: Color3.fromRGB(212, 69, 89),
			Disabled: Color3.fromRGB(120, 64, 64),
			Text: {
				Color: Color3.fromRGB(69, 31, 31),
				Disabled: Color3.fromRGB(69, 31, 31),
			},
			StoryIcon: {
				Color: Color3.fromRGB(69, 31, 31),
				Disabled: Color3.fromRGB(69, 31, 31),
			},
		},
	},
};

export = DarkRed;
