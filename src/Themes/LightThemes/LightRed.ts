import { LightColors } from ".";

const LightRed: Theme = {
	PureColor: {
		Color: new Color3(1, 1, 1),
		Inverse: Color3.fromRGB(33, 33, 56),
	},
	Text: LightColors.Text,
	Icon: {
		Color: Color3.fromRGB(23, 23, 23),
		Disabled: Color3.fromRGB(61, 61, 61),
	},
	Divisor: {
		Color: Color3.fromRGB(255, 0, 0),
		Transparency: 0.7,
	},
	Topbar: {
		Color: Color3.fromRGB(247, 107, 107),
		Logo: Color3.fromRGB(54, 28, 64),
	},
	Search: {
		Color: Color3.fromRGB(120, 143, 184),
		Placeholder: Color3.fromRGB(94, 94, 94),
		Stroke: Color3.fromRGB(255, 23, 23),
		StrokeTransparency: 0.3,
	},
	SidePanel: Color3.fromRGB(133, 163, 222),
	StoryPanel: {
		Color: Color3.fromRGB(122, 156, 232),
		PatternColor: Color3.fromRGB(0, 0, 0),
		PatternTransparency: 0.93,
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(64, 64, 64),
	},
	StoryPreview: {
		Color: Color3.fromRGB(31, 41, 64),
		Selected: Color3.fromRGB(212, 64, 59),
		TextSelected: Color3.fromRGB(41, 51, 61),
	},
	StoryTitle: {
		Color: Color3.fromRGB(250, 250, 250),
		Path: {
			Underline: Color3.fromRGB(120, 190, 120),
			PathText: Color3.fromRGB(120, 190, 120),
			ButtonColor: Color3.fromRGB(89, 89, 99),
		},
	},
	Nodes: {
		Normal: {
			Color: Color3.fromRGB(128, 128, 128),
			Disabled: Color3.fromRGB(171, 171, 171),
			StoryIcon: {
				Color: Color3.fromRGB(36, 82, 184),
				Disabled: Color3.fromRGB(66, 89, 138),
			},
			FolderIcon: {
				Color: Color3.fromRGB(201, 51, 51),
				Disabled: Color3.fromRGB(135, 64, 64),
			},
			Book: Color3.fromRGB(33, 150, 138),
		},
		StorySelected: {
			Color: Color3.fromRGB(212, 64, 59),
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
	Dropdown: {
		Color: Color3.fromRGB(89, 115, 171),
		TextHover: LightColors.Text.Color,
	},
};

export = LightRed;
