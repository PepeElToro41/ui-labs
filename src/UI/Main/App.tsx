import Roact from "@rbxts/roact";
import { useCallback, useContext, useMemo, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import Themes from "Plugin/Themes";
import { StoryContext } from "UI/Contexts/StoryContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import useStoryDisplaying from "UI/Hooks/useStoryDisplaying";
import MouseControl from "./MouseControl";
import AppPanel from "./AppPanel";
import TopBar from "./TopBar";
import { GlobalConnections } from "UI/Contexts/GlobalConnections";
import LogoStart from "./LogoStart";
import { SettingsContext } from "UI/Contexts/SettingsContext";
import Overlay from "./Overlay";
import { DefUILabsSettings } from "UI/Hooks/StoryTree/Searches/useSettings";
interface AppProps {}

function setProps(props: AppProps) {
	return props;
}

function AppCreate(setprops: AppProps) {
	const props = identity<Required<AppProps>>(setProps(setprops) as Required<AppProps>);
	const [selectedTheme, setTheme] = useState<Theme>(Themes.Default);
	const [displayedStoryNode, displayStoryNode, updateDisplayNode] = useStoryDisplaying();
	const settings = DefUILabsSettings;
	const setThemeName = useCallback((themeName: IsTheme) => {
		setTheme(Themes[themeName]);
	}, []);
	const storyContextValue = useMemo(() => {
		return {
			displayedNode: displayedStoryNode,
			displayNode: displayStoryNode,
			updateDisplayNode: updateDisplayNode,
		};
	}, [displayedStoryNode]);
	return (
		<GlobalConnections>
			<ThemeContext.Provider value={{ Theme: selectedTheme, SetTheme: setThemeName }}>
				<SettingsContext.Provider value={settings}>
					<MouseControl>
						<Overlay>
							<TopBar></TopBar>
							<StoryContext.Provider value={storyContextValue}>
								<AppPanel></AppPanel>
							</StoryContext.Provider>
						</Overlay>
					</MouseControl>
					<LogoStart></LogoStart>
				</SettingsContext.Provider>
			</ThemeContext.Provider>
		</GlobalConnections>
	);
}
const App = withHooks(AppCreate);

export = App;
