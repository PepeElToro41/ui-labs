import Dark from "./Dark";
import DarkRed from "./DarkRed";
import Light from "./Light";
import DarkMono from "./DarkMono";
import LightMono from "./LightMono";

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: DarkMono as Theme,
	Dark: Dark as Theme,
	Light: Light,
	DarkRed: DarkRed,
	DarkMono: DarkMono,
	LightMono: LightMono,
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}

export = Themes;
