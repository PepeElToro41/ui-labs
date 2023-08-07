declare global {
	type Sprites = typeof Sprites;
	type SpriteName = keyof Sprites;
}

const Sprites = {
	UILogo: {
		RectSize: new Vector2(128, 128),
		RectOffset: new Vector2(0, 64),
	},
	Search: {
		RectOffset: new Vector2(128, 0),
		RectSize: new Vector2(64, 64),
	},
	Close: {
		RectOffset: new Vector2(192, 192),
		RectSize: new Vector2(64, 64),
	},
};
export = Sprites;
