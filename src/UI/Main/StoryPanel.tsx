import Roact from "@rbxts/roact";
import { StoryToolBar, ToolData } from "../Story/StoryToolBar";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useCallback, useContext, useEffect, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { StoryContext } from "UI/Contexts/StoryContext";
import useStoryHandler from "UI/Hooks/useStoryHandler";
import StoryName from "../Story/StoryName";
import { EncodePath } from "Utils/NodeUtils";
import StoryPreview from "UI/Story/StoryPreview";
import { t } from "@rbxts/t";
import { useConnections } from "UI/Contexts/GlobalConnections";
import { useEventListener } from "@rbxts/pretty-roact-hooks";
import { PluginContext } from "UI/Contexts/PluginContext";
import { Image } from "UI/UIUtils/Styles/Image";
import { Div } from "UI/UIUtils/Styles/Div";
import { StoryNotSelected } from "UI/Story/StoryNotSelected";
import { CreateWindow } from "UI/Actions/WindowMap";
import ActionWindow from "UI/Actions/ActionWindow";
import { ActionsContext, useActions } from "UI/Contexts/ActionsContext";

function GetPathString(module: ModuleScript) {
	const path = EncodePath(module);
	if (!path) return undefined;
	const pathText = path.Service + "/" + path.Path.join("/") + "/" + path.ModuleName;
	return pathText;
}

interface StoryPanelProps {
	AddResize: number;
}

function setProps(props: StoryPanelProps) {
	return props;
}

function StoryPanelCreate(setprops: StoryPanelProps) {
	const props = identity<Required<StoryPanelProps>>(setProps(setprops) as Required<StoryPanelProps>);
	const theme = useContext(ThemeContext).Theme;
	const displayedNode = useContext(StoryContext).displayedNode;
	const pluginObject = useContext(PluginContext).PluginObject;
	const [storyHandle, storyHandleReload] = useStoryHandler(displayedNode);
	const toolbarConnections = useConnections().Toolbar;
	const actionsValue = useActions();
	const { ActionsData, ActionsAPI } = actionsValue;
	useEventListener(toolbarConnections.Reload, () => {
		storyHandleReload();
	});
	const storyPath = useMemo(() => {
		if (!displayedNode || !displayedNode.Module) return undefined;
		const pathText = GetPathString(displayedNode!.Module);
		return pathText;
	}, [displayedNode, displayedNode?.DisplayName, displayedNode?.Module]);
	const OpenStoryModule = useCallback(() => {
		if (!displayedNode) return;
		game.GetService("Selection").Set([displayedNode.Module]);
		if (!pluginObject) return;
		pluginObject.OpenScript(displayedNode.Module);
	}, [displayedNode, displayedNode?.Module]);

	const actionWindow = useMemo(() => {
		const activeWindows: Array<IsActiveWindow> = [];
		if (ActionsData.Sumary) {
			activeWindows.push(
				CreateWindow("Summary", {
					StoryName: ActionsData.Sumary.StoryName,
					Summary: ActionsData.Sumary.Summary,
				}),
			);
		}
		if (ActionsData.Controls) {
			activeWindows.push(
				CreateWindow("Controls", {
					Controls: ActionsData.Controls,
					Api: ActionsAPI,
				}),
			);
		}
		const window =
			activeWindows.size() > 0 ? <ActionWindow Key="ActionWindow" ActiveWindows={activeWindows}></ActionWindow> : undefined;
		return window;
	}, [ActionsData]);
	return (
		<frame
			Key="StoryPanel"
			BackgroundColor3={theme.EditorBackground}
			BorderSizePixel={0}
			LayoutOrder={1}
			Size={new UDim2(1, -props.AddResize, 1, 0)}
		>
			<Image
				Key="Background"
				Image="rbxassetid://13745469099"
				ImageColor3={theme.EditorPattern}
				ImageTransparency={0.95}
				ScaleType={Enum.ScaleType.Tile}
				TileSize={new UDim2(0, 90, 0, 90)}
			/>
			<ActionsContext.Provider value={actionsValue}>
				<Div Key="Frame" ZIndex={2}>
					<StoryName
						StoryName={displayedNode && displayedNode.DisplayName}
						Theme={theme}
						StoryPath={storyPath}
						OpenStoryModule={OpenStoryModule}
					></StoryName>
					<Div Key="StoryFrame" Size={new UDim2(1, 0, 1, -35)} LayoutOrder={1}>
						<StoryNotSelected Visible={displayedNode === undefined} Theme={theme}></StoryNotSelected>
						<StoryPreview StoryHandle={storyHandle}></StoryPreview>
						<StoryToolBar></StoryToolBar>
					</Div>
					<uilistlayout Padding={new UDim(0, 0)} SortOrder={Enum.SortOrder.LayoutOrder} />
				</Div>
				{actionWindow ? actionWindow : undefined}
			</ActionsContext.Provider>
		</frame>
	);
}
const StoryPanel = withHooksPure(StoryPanelCreate);

export = StoryPanel;
