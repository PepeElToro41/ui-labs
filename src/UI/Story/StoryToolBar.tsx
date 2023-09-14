import Roact from "@rbxts/roact";
import { useContext, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { useConnections } from "UI/Contexts/GlobalConnections";
import { StoryContext } from "UI/Contexts/StoryContext";
import { Copy } from "Utils/TableUtil";
import StoryTool from "../UIUtils/StoryTool";

export interface ToolData {
	RectOffset: Vector2;
	RectSize?: Vector2;
	ButtonName: string;
	Description: string;
	IconPos?: UDim2;
	IconSize?: UDim2;
	Toggeable?: boolean;
	OnClick: (enabled?: boolean) => void;
}

interface StoryToolBarProps {}

function setProps(props: StoryToolBarProps) {
	return props;
}

function StoryToolBarCreate(setprops: StoryToolBarProps) {
	const props = setProps(setprops);
	const story = useContext(StoryContext).displayedNode;
	const toolbarConnections = useConnections().Toolbar;
	const ToolsList: (ToolData | "Separate")[] = useMemo(() => {
		return [
			{
				ButtonName: "Reload",
				Description: "Reload Story",
				RectOffset: new Vector2(128, 128),
				IconSize: UDim2.fromOffset(28, 28),
				OnClick: () => {
					toolbarConnections.Reload.Fire();
				},
			},
			{
				ButtonName: "ZoomIn",
				Description: "Zoom In",
				RectOffset: new Vector2(0, 0),
				OnClick: () => {
					toolbarConnections.ZoomIn.Fire();
				},
			},
			{
				ButtonName: "ZoomOut",
				Description: "Zoom Out",
				RectOffset: new Vector2(64, 0),
				OnClick: () => {
					toolbarConnections.ZoomOut.Fire();
				},
			},
			{
				ButtonName: "InViewport",
				Description: "View in Viewport",
				RectOffset: new Vector2(192, 0),
				Toggeable: true,
				OnClick: (enabled?: boolean) => {
					toolbarConnections.InViewport.Fire(enabled!);
				},
			},
			{
				ButtonName: "Explore",
				Description: "View in Exporer",
				RectOffset: new Vector2(192, 64),
				OnClick: () => {
					toolbarConnections.Explore.Fire();
				},
			},
			"Separate",
			{
				ButtonName: "Measure",
				Description: "Measure Tool",
				RectOffset: new Vector2(128, 256),
				Toggeable: true,
				OnClick: (enabled?: boolean) => {
					toolbarConnections.Measure.Fire(enabled!);
				},
			},
		];
	}, []);

	const ToolElements = useMemo<Array<Roact.Element>>(() => {
		const ReturnList: Array<Roact.Element> = [];
		ToolsList.forEach((tool, index) => {
			if (tool === "Separate") {
				ReturnList.push(
					<frame Key="Separator" Size={new UDim2(1, 0, 0, 10)} LayoutOrder={index} BackgroundTransparency={1} />,
				);
			} else {
				ReturnList.push(
					<StoryTool
						Key={tostring(index + 1) + tool.ButtonName}
						ButtonName={tool.ButtonName}
						Description={tool.Description}
						LayoutOrder={index}
						Icon={{
							RectOffset: tool.RectOffset,
							RectSize: tool.RectSize,
							Pos: tool.IconPos ?? UDim2.fromScale(0.5, 0.5),
							Size: tool.IconSize ?? UDim2.fromOffset(30, 30),
						}}
						Toggleable={tool.Toggeable ?? false}
						OnClick={tool.OnClick}
					></StoryTool>,
				);
			}
		});
		return ReturnList;
	}, [ToolsList]);

	return (
		<frame
			Key="Tools"
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundTransparency={1}
			Position={new UDim2(0, 3, 0, 0)}
			Size={new UDim2(0, 30, 1, 0)}
			Visible={story !== undefined}
		>
			<uilistlayout Padding={new UDim(0, 7)} SortOrder={Enum.SortOrder.LayoutOrder} />
			{/*Tool Buttons*/}
			{...ToolElements}
		</frame>
	);
}

export const StoryToolBar = withHooksPure(StoryToolBarCreate);
