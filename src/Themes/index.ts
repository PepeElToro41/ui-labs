import Dark from "./DarkThemes/Dark";
import DarkRed from "./DarkThemes/DarkRed";
import Light from "./LightThemes/Light";
import DarkMono from "./DarkThemes/DarkMono";
import LightMono from "./LightThemes/LightMono";
import { CatppuchineFrappe, CatppuchineLatte, CatppuchineMacchiato, CatppuchineMocha } from "./Catppuccin";
import LightRed from "./LightThemes/LightRed";

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: Dark as Theme,
	//DARK
	Dark: Dark as Theme,
	DarkRed: DarkRed,
	DarkMono: DarkMono,
	//LIGHT
	Light: Light,
	LightRed: LightRed,
	LightMono: LightMono,
	//CATPPUCHINE
	CatppuchineLatte: CatppuchineLatte,
	CatppuchineFrappe: CatppuchineFrappe,
	CatppuchineMacchiato: CatppuchineMacchiato,
	CatppuchineMocha: CatppuchineMocha,
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}

export = Themes;
