import { createProducer } from "@rbxts/reflex";
import Themes from "Themes";

interface ThemeState {
	theme: Theme;
	themeIndex: ThemeName;
	isLightBackground: boolean;
}

const initialTheme: ThemeName = "Default";

const initialState: ThemeState = {
	theme: Themes[initialTheme],
	themeIndex: initialTheme,
	isLightBackground: false
};

export const selectTheme = (state: RootState) => state.theme;
export const selectThemeIndex = (state: RootState) => state.theme.themeIndex;
export const selectIsLightBackground = (state: RootState) => state.theme.isLightBackground;

export const ThemeProducer = createProducer(initialState, {
	setTheme: (state, theme: Theme) => {
		return { ...state, theme, themeIndex: theme.ThemeName! };
	},
	setThemeIndex: (state, themeIndex: ThemeName) => {
		return { ...state, theme: Themes[themeIndex], themeIndex };
	},
	setIsLightBackground: (state, light: boolean) => {
		return { ...state, isLightBackground: light };
	}
});
