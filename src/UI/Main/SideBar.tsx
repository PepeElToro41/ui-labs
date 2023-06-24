import Roact from "@rbxts/roact";
import SearchInput from "../UIUtils/SearchInput";
import CreateFolder from "../Side/StoryNodes/StoryFolder";
import ThemeContext from "UI/Contexts/ThemeContext";
import SideTools from "../Side/SideTools";
import { useCallback, useContext, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import StoryTree from "../Side/StoryTree";
import useHierarchy from "UI/Hooks/StoryTree/useHierarchy";
import useStoryNodes from "UI/Hooks/StoryTree/useStoryNodes";
import { PluginContext } from "UI/Contexts/PluginContext";
import Configs from "Plugin/Configs";
import { StoryContext } from "UI/Contexts/StoryContext";
import useStorySearch from "UI/Hooks/StoryTree/useStorySearch";
import { useEventListener } from "@rbxts/pretty-roact-hooks";

interface SideBarProps {}

function setProps(props: SideBarProps) {
	return props;
}

function SideBarCreate(setprops: SideBarProps) {
	const props = identity<Required<SideBarProps>>(setProps(setprops) as Required<SideBarProps>);
	const [search, setSearch] = useState<string | undefined>(undefined);
	const externalControls = useContext(PluginContext).ExternalControls;
	const [getHierarchy, recalculateHierarchy, setHierarchy] = useHierarchy(
		Configs.DefaultHierarchy,
		externalControls.setHierarchy,
		"Path",
	);
	const [storyList, triggerHierarchy, triggerNodes] = useStorySearch();
	const [storyNodes, recalculateNodes, newFolder] = useStoryNodes(storyList, getHierarchy, recalculateHierarchy);
	useEventListener(triggerHierarchy, () => {
		recalculateHierarchy(storyNodes);
	});
	const mapSearch = useCallback((searchSet: string | undefined) => {
		if (typeIs(searchSet, "string") && searchSet !== "") {
			setSearch(searchSet);
		} else {
			setSearch(undefined);
		}
	}, []);
	const theme = useContext(ThemeContext).Theme;
	return (
		<frame
			Key="SideBar"
			AnchorPoint={new Vector2(0, 1)}
			BackgroundColor3={theme.SideBar}
			BorderSizePixel={0}
			Position={new UDim2(0, 0, 1, 0)}
			Size={new UDim2(0, 250, 1, 0)}
		>
			<uipadding
				PaddingBottom={new UDim(0, 12)}
				PaddingLeft={new UDim(0, 12)}
				PaddingRight={new UDim(0, 12)}
				PaddingTop={new UDim(0, 12)}
			/>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 10)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<SearchInput
				Key="SearchInput"
				OnSearchChanged={(search: string) => mapSearch(search)}
				LayoutOrder={1}
				Size={new UDim2(1, 0, 0, 27)}
				Position={new UDim2(0, 0, 0, 0)}
				Placeholder="Search Component"
			></SearchInput>
			<SideTools LayoutOrder={2}></SideTools>
			<StoryTree Filter={search} Folders={storyNodes}></StoryTree>
		</frame>
	);
}
const SideBar = withHooks(SideBarCreate);

export = SideBar;
