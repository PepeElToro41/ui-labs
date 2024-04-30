import Dark from "./DarkThemes/Dark";
import { CatppuchineFrappe, CatppuchineLatte, CatppuchineMacchiato, CatppuchineMocha } from "./Catppuccin";
import DarkMono from "./DarkThemes/DarkMono";
import { Purple } from "./Colors/Purple";

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: CatppuchineMacchiato as Theme,
	//DARK
	Dark: Dark as Theme,
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

export default Themes;
