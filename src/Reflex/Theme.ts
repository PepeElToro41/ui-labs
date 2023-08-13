import { createProducer } from "@rbxts/reflex";
import Themes from "Themes";

interface ThemeState {
	theme: Theme;
	themeIndex: ThemeName;
}

const initialState: ThemeState = {
	theme: Themes.Default,
	themeIndex: "Default",
};

export const selectTheme = (state: RootState) => state.theme;

export const ThemeProducer = createProducer(initialState, {
	setTheme: (state, theme: Theme) => {
		return { ...state, theme, themeIndex: theme.ThemeName! };
	},
	setThemeIndex: (state, themeIndex: ThemeName) => {
		return { ...state, theme: Themes[themeIndex], themeIndex };
	},
});
