const Palette = {
	Light: Color3.fromRGB(194, 163, 252),
	Accent: Color3.fromRGB(137, 76, 255),
	Disabled: Color3.fromRGB(64, 46, 150),
	Grayed: Color3.fromRGB(36, 26, 79),
	Background1: Color3.fromRGB(26, 5, 74),
	Background2: Color3.fromRGB(18, 5, 51),
};

export const Purple: Theme = {
	PureColor: {
		Color: Color3.fromRGB(36, 36, 36),
		Inverse: new Color3(1, 1, 1),
	},
	Text: {
		Color: Color3.fromRGB(240, 199, 255),
		Disabled: Color3.fromRGB(176, 133, 191),
		Inverted: Color3.fromRGB(38, 13, 38),
	},
	Icon: {
		Color: Color3.fromRGB(240, 212, 252),
		Active: Palette.Accent,
		Disabled: Color3.fromRGB(176, 133, 191),
	},
	ResizePanelDrag: Color3.fromRGB(224, 105, 255),
	Divisor: {
		Color: Palette.Light,
		Transparency: 0.7,
	},
	Topbar: {
		Color: Palette.Grayed,
		Logo: Palette.Light,
	},
	Search: {
		Color: Palette.Disabled,
		Placeholder: Palette.Light,
	},
	SidePanel: Palette.Background2,
	StoryPanel: {
		Color: Palette.Grayed,
		PatternColor: Color3.fromRGB(255, 255, 255),
		PatternTransparency: 0.95,
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(56, 56, 56),
	},
	StoryPreview: {
		Background: Palette.Background1,
		Color: Color3.fromRGB(79, 79, 79),
		Selected: Palette.Accent,
		TextSelected: Color3.fromRGB(27, 37, 48),
		CloseButton: Color3.fromRGB(255, 255, 255),

		InfoToast: Palette.Background2,
	},
	ColorPicker: {
		Background: Palette.Background2,
		Handle: Palette.Light,
	},
	//NODES

	Normal: {
		Color: Color3.fromRGB(82, 82, 92),
		StoryIcon: Color3.fromRGB(254, 52, 113),
		FolderIcon: Color3.fromRGB(254, 212, 57),
		Book: Color3.fromRGB(8, 236, 183),
	},
	StorySelected: {
		Color: Palette.Accent,
		StoryIcon: Color3.fromRGB(38, 8, 43),
	},

	Dropdown: {
		Color: Palette.Background1,
		TextHover: Color3.fromRGB(255, 255, 255),
	},
	//CONTROLS

	Boolean: {
		SwitchOn: Palette.Background2,
		SwitchOff: Palette.Accent,
		SwitchBackOn: Palette.Accent,
		SwitchBackOff: Palette.Background2,
	},
	List: {
		Frame: Color3.fromRGB(48, 48, 48),
		FrameHovered: Color3.fromRGB(66, 66, 66),
	},
};
