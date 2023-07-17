import Roact from "@rbxts/roact";
import SearchInput from "../UIUtils/SearchInput";
import ThemeContext from "UI/Contexts/ThemeContext";
import SideTools from "../Side/SideTools";
import { useCallback, useContext, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import StoryTree from "../Side/StoryTree";
import useStoryNodes from "UI/Hooks/StoryTree/useStoryNodes";
import ResizableFrame from "UI/UIUtils/ResizableFrame";
import { useSettingsContext } from "UI/Contexts/SettingsContext";
import Configs from "Plugin/Configs";

interface SideBarProps {
	OnAddResize: (add: number) => void;
}

function setProps(props: SideBarProps) {
	return props;
}

function SideBarCreate(setprops: SideBarProps) {
	const props = identity<Required<SideBarProps>>(setProps(setprops) as Required<SideBarProps>);
	const [search, setSearch] = useState<string | undefined>(undefined);
	const settings = useSettingsContext();
	const searchService = settings.ServiceSearch ?? Configs.SearchServices;
	const LibsInfo = useMemo<UILibsPartial>(() => {
		return {
			react: settings.react,
			roact: settings.roact,
			reactRoblox: settings.reactRoblox,
		};
	}, [settings]);
	const [storyNodes] = useStoryNodes(searchService, LibsInfo);
	const mapSearch = useCallback((searchSet: string | undefined) => {
		if (typeIs(searchSet, "string") && searchSet !== "") {
			setSearch(searchSet);
		} else {
			setSearch(undefined);
		}
	}, []);
	const theme = useContext(ThemeContext).Theme;
	const OnResized = useCallback((collapsed: boolean, size: number) => {
		if (collapsed) {
			props.OnAddResize(0);
		} else {
			props.OnAddResize(250 + size);
		}
	}, []);

	return (
		<ResizableFrame
			Key="SideBar"
			BaseSize={new UDim2(0, 250, 1, 0)}
			ResizeRange={new NumberRange(-80, 300)}
			MaxBeforeCollapse={-180}
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: new UDim2(0, 0, 1, 0),
			}}
			OnResized={(collapsed: boolean, size: number) => OnResized(collapsed, size)}
			FrameProps={{
				BackgroundColor3: theme.SideBar,
				BackgroundTransparency: 0,
				BorderSizePixel: 0,
			}}
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
		</ResizableFrame>
	);
}
const SideBar = withHooks(SideBarCreate);

export = SideBar;
