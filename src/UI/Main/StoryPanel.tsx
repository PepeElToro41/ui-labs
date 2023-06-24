import Roact from "@rbxts/roact";
import { StoryToolBar, ToolData } from "../Story/StoryToolBar";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useContext, useEffect, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { StoryContext } from "UI/Contexts/StoryContext";
import useStoryHandler from "UI/Hooks/useStoryHandler";
import StoryName from "../Story/StoryName";
import { EncodePath } from "Utils/NodeUtils";
import StoryPreview from "UI/Story/StoryPreview";
import { t } from "@rbxts/t";

function GetPathString(module: ModuleScript) {
	const path = EncodePath(module);
	if (!path) return undefined;
	const pathText = path.Service + "/" + path.Path.join("/") + "/" + path.ModuleName;
	return pathText;
}

interface StoryPanelProps {}
function setProps(props: StoryPanelProps) {
	return props;
}

function StoryPanelCreate(setprops: StoryPanelProps) {
	const props = identity<Required<StoryPanelProps>>(setProps(setprops) as Required<StoryPanelProps>);
	const theme = useContext(ThemeContext).Theme;
	const displayedNode = useContext(StoryContext).displayedNode;
	const [storyHandle] = useStoryHandler(displayedNode);

	useEffect(() => {
		print("STORY HANDLE CHANGED", storyHandle?.Result);
	}, [storyHandle]);

	const storyPath = useMemo(() => {
		if (!displayedNode || !displayedNode.Module) return undefined;
		const pathText = GetPathString(displayedNode!.Module);
		return pathText;
	}, [displayedNode, displayedNode?.DisplayName, displayedNode?.Module]);

	return (
		<frame
			Key="StoryPanel"
			BackgroundColor3={theme.EditorBackground}
			BorderSizePixel={0}
			LayoutOrder={1}
			Size={new UDim2(1, -250, 1, 0)}
		>
			<imagelabel
				Key="Background"
				BackgroundTransparency={1}
				Image="rbxassetid://13745469099"
				ImageColor3={theme.EditorPattern}
				ImageTransparency={0.95}
				ScaleType={Enum.ScaleType.Tile}
				Size={new UDim2(1, 0, 1, 0)}
				TileSize={new UDim2(0, 90, 0, 90)}
			/>
			<frame Key="Frame" BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} ZIndex={2}>
				<StoryName
					StoryName={displayedNode && displayedNode.DisplayName}
					Theme={theme}
					StoryPath={storyPath}
				></StoryName>
				<frame Key="StoryFrame" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, -35)} LayoutOrder={1}>
					<StoryPreview></StoryPreview>
					<StoryToolBar></StoryToolBar>
				</frame>
				<uilistlayout Padding={new UDim(0, 3)} SortOrder={Enum.SortOrder.LayoutOrder} />
			</frame>
		</frame>
	);
}
const StoryPanel = withHooksPure(StoryPanelCreate);

export = StoryPanel;
