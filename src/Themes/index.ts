import {
	CatppuchineFrappe,
	CatppuchineLatte,
	CatppuchineMacchiato,
	CatppuchineMocha
} from "./Catppuccin";
import Dark from "./DarkThemes/Dark";
import Sour from "./DarkThemes/Sour";

declare global {
	type Theme = typeof Dark & { ThemeName?: keyof typeof Themes };
	type ThemeName = keyof typeof Themes;
}

const Themes = {
	Default: Dark as Theme,
	//DARK
	Dark: Dark as Theme,
	Sour: Sour as Theme,
	//CATPPUCHINE
	CatppuchineLatte: CatppuchineLatte,
	CatppuchineFrappe: CatppuchineFrappe,
	CatppuchineMacchiato: CatppuchineMacchiato,
	CatppuchineMocha: CatppuchineMocha
};

for (const [themeName, theme] of pairs(Themes)) {
	//Adding ThemeName to every theme
	theme["ThemeName"] = themeName;
}

export default Themes;
