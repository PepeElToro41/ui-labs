declare global {
	type Sprites = typeof Sprites;
	type Sprite = {
		RectOffset: Vector2;
		RectSize?: Vector2;
	};
	type SpriteName = keyof Sprites;
}

//Default RectSize is 64x64

const Sprites = {
	UILogo: {
		RectOffset: new Vector2(0, 64),
		RectSize: new Vector2(128, 128),
	},
	Search: {
		RectOffset: new Vector2(64 * 2, 0),
	},
	Close: {
		RectOffset: new Vector2(64 * 3, 64 * 3),
	},
	//Nodes
	StoryIcon: {
		RectOffset: new Vector2(64, 64 * 3),
	},
	FolderIcon: {
		RectOffset: new Vector2(0, 64 * 3),
	},
	BookIcon: {
		RectOffset: new Vector2(64 * 3, 64 * 4),
	},
	Expand: {
		RectOffset: new Vector2(64 * 2, 64),
	},
	Collapse: {
		RectOffset: new Vector2(64 * 3, 64 * 2),
	},
	UnknownIcon: {
		RectOffset: new Vector2(64 * 3, 64 * 5),
	},
	//Toolbar
	Reload: {
		RectOffset: new Vector2(64 * 2, 64 * 2),
	},
	ZoomIn: {
		RectOffset: new Vector2(0, 0),
	},
	ZoomOut: {
		RectOffset: new Vector2(64, 0),
	},
	ViewOnViewport: {
		RectOffset: new Vector2(64 * 3, 0),
	},
	ViewOnExplorer: {
		RectOffset: new Vector2(64 * 3, 64),
	},
	SelectElements: {
		RectOffset: new Vector2(64 * 2, 64 * 5),
	},
	FullscreenMode: {
		RectOffset: new Vector2(64 * 4, 64 * 5),
	},
	LightBackground: {
		RectOffset: new Vector2(64 * 5, 64 * 2),
	},
	MeasureTool: {
		RectOffset: new Vector2(64 * 2, 64 * 4),
	},
	ShowOutlines: {
		RectOffset: new Vector2(64 * 5, 0),
	},
	MouseRules: {
		RectOffset: new Vector2(64 * 5, 64),
	},

	//Other
	Theme: {
		RectOffset: new Vector2(0, 64 * 5),
	},
	Dragger: {
		RectOffset: new Vector2(64, 64 * 5),
	},
	Picker: {
		RectOffset: new Vector2(64 * 4, 0),
	},
};
export default Sprites;
