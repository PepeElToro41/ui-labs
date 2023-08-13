import Dark from "./Dark";
import Light from "./Light";

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: Dark as Theme,
	Dark: Dark as Theme,
	Light: Light,
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}

export = Themes;
