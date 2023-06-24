import Roact from "@rbxts/roact";
import Themes from "Plugin/Themes";

const ThemeContext = Roact.createContext<{ Theme: Theme; SetTheme?: (Set: IsTheme) => void }>({
	Theme: Themes.Default,
	SetTheme: (Set: IsTheme) => {},
});

export default ThemeContext;
