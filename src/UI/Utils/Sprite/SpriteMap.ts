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
		RectOffset: new Vector2(128, 0),
	},
	Close: {
		RectOffset: new Vector2(192, 192),
	},
	//Nodes
	StoryIcon: {
		RectOffset: new Vector2(64, 192),
	},
	FolderIcon: {
		RectOffset: new Vector2(0, 192),
	},
	BookIcon: {
		RectOffset: new Vector2(192, 256),
	},
	Expand: {
		RectOffset: new Vector2(128, 64),
	},
	Collapse: {
		RectOffset: new Vector2(196, 128),
	},
};
export = Sprites;
