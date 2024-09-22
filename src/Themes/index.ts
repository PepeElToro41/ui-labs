import { DarkOne } from "./DarkOne";

declare global {
	type Theme = typeof DarkOne & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: DarkOne as Theme,
	DarkOne: DarkOne as Theme,
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}

export default Themes;
