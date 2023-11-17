import { DarkColors } from ".";

const DarkMono: Theme = {
	PureColor: {
		Color: Color3.fromRGB(36, 36, 36),
		Inverse: new Color3(1, 1, 1),
	},
	Text: DarkColors.Text,
	Icon: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(102, 102, 102),
	},
	Divisor: {
		Color: Color3.fromRGB(150, 150, 150),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(38, 38, 38),
		Logo: Color3.fromRGB(255, 255, 255),
	},
	Search: {
		Color: Color3.fromRGB(33, 33, 33),
		Placeholder: Color3.fromRGB(130, 130, 130),
		Stroke: Color3.fromRGB(150, 150, 150),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(48, 48, 48),
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
	StoryPreview: {
		Color: Color3.fromRGB(31, 41, 64),
		Selected: Color3.fromRGB(255, 255, 255),
		TextSelected: Color3.fromRGB(27, 37, 48),
	},
	StoryTitle: {
		Color: Color3.fromRGB(39, 39, 39),

		Path: {
			Underline: Color3.fromRGB(181, 181, 181),
			PathText: Color3.fromRGB(171, 171, 171),
			ButtonColor: Color3.fromRGB(89, 89, 99),
		},
	},
	Nodes: {
		Normal: {
			Color: Color3.fromRGB(82, 82, 92),
			Disabled: Color3.fromRGB(54, 54, 59),
			StoryIcon: {
				Color: Color3.fromRGB(168, 168, 168),
				Disabled: Color3.fromRGB(99, 99, 99),
			},
			FolderIcon: {
				Color: Color3.fromRGB(0, 0, 0),
				Disabled: Color3.fromRGB(33, 33, 33),
			},
			Book: Color3.fromRGB(255, 255, 255),
		},
		StorySelected: {
			Color: Color3.fromRGB(255, 255, 255),
			Disabled: Color3.fromRGB(150, 150, 150),
			StoryIcon: {
				Color: Color3.fromRGB(31, 48, 66),
				Disabled: Color3.fromRGB(28, 36, 46),
			},
			Text: {
				Color: Color3.fromRGB(27, 37, 48),
				Disabled: Color3.fromRGB(23, 28, 33),
			},
		},
	},
	Dropdown: {
		Color: DarkColors.Dropdown.Color,
		TextHover: DarkColors.Text.Inverted,
	},
};

export = DarkMono;
