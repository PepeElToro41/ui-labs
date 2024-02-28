const Palette = {
	Green: Color3.fromRGB(48, 222, 156),
	Blue: Color3.fromRGB(39, 141, 209),
};

const Dark = {
	PureColor: {
		Color: Color3.fromRGB(36, 36, 36),
		Inverse: new Color3(1, 1, 1),
	},
	Text: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(150, 150, 150),
		Inverted: Color3.fromRGB(38, 38, 38),
	},
	Icon: {
		Color: Color3.fromRGB(255, 255, 255),
		Active: Palette.Blue,
		Disabled: Color3.fromRGB(102, 102, 102),
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
	StoryPreview: {
		Background: Color3.fromRGB(39, 39, 39),
		Color: Color3.fromRGB(24, 24, 24),
		Selected: Palette.Blue,
		TextSelected: Color3.fromRGB(27, 37, 48),
		CloseButton: Color3.fromRGB(255, 255, 255),
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
		Color: Color3.fromRGB(38, 38, 38),
		TextHover: Color3.fromRGB(255, 255, 255),
	},
	Controls: {
		Boolean: {
			SwitchOn: Palette.Green,
			SwitchOff: Color3.fromRGB(56, 56, 56),
			SwitchBackOn: Color3.fromRGB(255, 255, 255),
			SwitchBackOff: Color3.fromRGB(255, 255, 255),
		},
		List: {
			Frame: Color3.fromRGB(23, 28, 33),
			FrameHovered: Color3.fromRGB(23, 28, 33),
		},
	},
};

export default Dark;
