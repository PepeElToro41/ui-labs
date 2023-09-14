const Dark = {
	PureColor: Color3.fromRGB(0, 0, 0),
	TextColor: Color3.fromRGB(255, 255, 255),
	TextDisabledColor: Color3.fromRGB(150, 150, 150),
	Divisor: new Color3(0.59, 0.59, 0.59),
	//Side Bar
	SideBar: Color3.fromRGB(24, 24, 24),
	IconsColor: new Color3(1, 1, 1),
	IconsDisableColor: Color3.fromRGB(105, 105, 105),
	SearchInput: Color3.fromRGB(49, 49, 53),
	SearchPlaceholder: Color3.fromRGB(161, 161, 161),
	//Story Node
	StoryIdle: {
		Entry: Color3.fromRGB(82, 82, 92),
		Disabled: Color3.fromRGB(54, 54, 59),
		Image: Color3.fromRGB(115, 179, 237),
		DisabledImage: Color3.fromRGB(71, 107, 140),
		//FOLDERS
		FolderImage: Color3.fromRGB(196, 135, 232),
		FolderDisabledImage: Color3.fromRGB(122, 84, 145),
		//BOOKS
		BookImage: Color3.fromRGB(48, 222, 156),
	},
	StoryDisplayed: {
		//NODE
		Entry: Color3.fromRGB(39, 141, 209),
		Disabled: Color3.fromRGB(38, 77, 102),
		Text: Color3.fromRGB(27, 37, 48),
		DisabledText: Color3.fromRGB(23, 28, 33),
		//IMAGE
		Image: Color3.fromRGB(31, 48, 66),
		DisabledImage: Color3.fromRGB(28, 36, 46),
	},
	StorySelected: {},
	//Image Button
	ButtonColor: Color3.fromRGB(89, 89, 99),
	ButtonIcon: Color3.fromRGB(170, 170, 170),
	ButtonIconHover: new Color3(1, 1, 1),
	//Top Bar
	TopBar: Color3.fromRGB(33, 31, 53),
	LogoColor: Color3.fromRGB(227, 179, 255),
	TopControl: Color3.fromRGB(83, 83, 83),
	//Story Editor
	StoryName: Color3.fromRGB(38, 38, 38),
	StoryPathText: Color3.fromRGB(120, 190, 120),
	EditorBackground: Color3.fromRGB(34, 34, 34),
	EditorPattern: new Color3(1, 1, 1),
	ToolIconActive: Color3.fromRGB(54, 173, 255),
	//Descriptor
	Descriptor: Color3.fromRGB(214, 214, 214),
	DescriptorText: Color3.fromRGB(38, 38, 38),
	//Actions
	ActionWindow: Color3.fromRGB(31, 31, 31),
	//Controls
	ControlTheme: {
		Bool: {
			OffBackground: Color3.fromRGB(80, 94, 132),
		},
		Slider: {
			NonFillColor: Color3.fromRGB(56, 82, 106),
		},
		EnumList: {
			ListLabel: Color3.fromRGB(24, 24, 24),
			ListEntry: Color3.fromRGB(82, 82, 92),
		},
	},
	//Overlay
	ColorPickerWindow: Color3.fromRGB(24, 24, 24),
};
const Light: Theme = {
	PureColor: Color3.fromRGB(255, 255, 255),
	TextColor: Color3.fromRGB(38, 38, 38),
	TextDisabledColor: Color3.fromRGB(92, 92, 92),
	Divisor: new Color3(0, 0, 0),
	//Side Bar
	SideBar: Color3.fromRGB(212, 212, 212),
	IconsColor: new Color3(0, 0, 0),
	IconsDisableColor: Color3.fromRGB(145, 145, 145),
	SearchInput: Color3.fromRGB(156, 156, 161),
	SearchPlaceholder: Color3.fromRGB(94, 94, 94),
	//Story Node
	StoryIdle: {
		Entry: Color3.fromRGB(161, 161, 161),
		Disabled: Color3.fromRGB(204, 201, 201),
		Image: Color3.fromRGB(54, 148, 235),
		DisabledImage: Color3.fromRGB(54, 99, 140),
		//FOLDERS
		FolderImage: Color3.fromRGB(196, 97, 255),
		FolderDisabledImage: Color3.fromRGB(102, 48, 135),
		//BOOKS
		BookImage: Color3.fromRGB(0, 191, 112),
	},
	StoryDisplayed: {
		//NODE
		Entry: Color3.fromRGB(92, 181, 247),
		Disabled: Color3.fromRGB(158, 194, 222),
		Text: Color3.fromRGB(27, 37, 48),
		DisabledText: Color3.fromRGB(79, 99, 117),
		//IMAGE
		Image: Color3.fromRGB(17, 31, 44),
		DisabledImage: Color3.fromRGB(79, 99, 117),
	},
	StorySelected: {},
	//Image Button
	ButtonColor: Color3.fromRGB(148, 148, 148),
	ButtonIcon: Color3.fromRGB(71, 71, 71),
	ButtonIconHover: Color3.fromRGB(30, 30, 30),
	//Top Bar
	TopBar: Color3.fromRGB(166, 156, 222),
	LogoColor: Color3.fromRGB(86, 57, 116),
	TopControl: Color3.fromRGB(133, 136, 153),
	//Story Editor
	StoryName: Color3.fromRGB(255, 255, 255),
	StoryPathText: Color3.fromRGB(56, 128, 56),
	EditorBackground: Color3.fromRGB(183, 183, 183),
	EditorPattern: new Color3(0, 0, 0),
	ToolIconActive: Color3.fromRGB(25, 133, 216),
	//Descriptor
	Descriptor: Color3.fromRGB(82, 83, 102),
	DescriptorText: Color3.fromRGB(255, 255, 255),
	//Actions
	ActionWindow: Color3.fromRGB(201, 201, 201),
	//Controls
	ControlTheme: {
		Bool: {
			OffBackground: Color3.fromRGB(138, 163, 196),
		},
		Slider: {
			NonFillColor: Color3.fromRGB(133, 161, 189),
		},
		EnumList: {
			ListLabel: Color3.fromRGB(214, 214, 214),
			ListEntry: Color3.fromRGB(161, 161, 161),
		},
	},
	//Overlay
	ColorPickerWindow: Color3.fromRGB(212, 212, 212),
};

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type IsTheme = keyof typeof Themes;
}

const Themes = {
	Dark: Dark,
	Light: Light,
	Default: Dark,
};

for (const [themeName, theme] of pairs(Themes)) {
	(theme as Theme)["ThemeName"] = themeName;
}

export = Themes;
