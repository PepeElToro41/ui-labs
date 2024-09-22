import Vide, { ProviderChildren, source } from "@rbxts/vide";
import Themes from "Themes";
import { constant } from "Utils/Vide";

const ThemeContext = Vide.create_context<Vide.Source<Theme>>(constant(Themes.Default));

function ThemeProvider(props: ProviderChildren) {
	const theme = source(Themes.Default);

	return ThemeContext.provide(theme, props.children);
}

export function useTheme() {
	const theme = ThemeContext.consume();

	function themeSource(): Theme;
	function themeSource<K extends keyof Theme>(entry: K): () => Theme[K];
	function themeSource<K extends keyof Theme>(entry?: K): any {
		if (entry !== undefined) {
			return () => theme()[entry];
		}
		return theme();
	}
	return themeSource;
}

export function useThemeSource() {
	return ThemeContext.consume();
}

export default ThemeProvider;
