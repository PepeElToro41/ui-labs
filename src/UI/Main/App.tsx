import { useInterval } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useCallback, useMemo, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import Themes from "Plugin/Themes";
import { StoryContext } from "UI/Contexts/StoryContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import useStoryDisplaying from "UI/Hooks/useStoryDisplaying";
import MouseControl from "./MouseControl";
import AppPanel from "./AppPanel";
import { TopBar, TopControlProps } from "./TopBar";

const TopControls: TopControlProps[] = [
	{
		ControlName: "File",
		ControlLabel: "File",
	},
	{
		ControlName: "View",
		ControlLabel: "View",
	},
	{
		ControlName: "Export",
		ControlLabel: "Export",
	},
	{
		ControlName: "About",
		ControlLabel: "About",
	},
];
interface AppProps {}

function setProps(props: AppProps) {
	return props;
}

function AppCreate(setprops: AppProps) {
	const props = identity<Required<AppProps>>(setProps(setprops) as Required<AppProps>);
	const [selectedTheme, setTheme] = useState<Theme>(Themes.Default);
	const [displayedStoryNode, displayStoryNode, updateDisplayNode] = useStoryDisplaying();
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
		<ThemeContext.Provider value={{ Theme: selectedTheme, SetTheme: setThemeName }}>
			<MouseControl
				children={[
					<TopBar TopControls={TopControls}></TopBar>,
					<StoryContext.Provider value={storyContextValue}>
						<AppPanel></AppPanel>
					</StoryContext.Provider>,
				]}
			></MouseControl>
		</ThemeContext.Provider>
	);
}
const App = withHooks(AppCreate);

export = App;
