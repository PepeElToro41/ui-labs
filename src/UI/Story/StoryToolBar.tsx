import Roact from "@rbxts/roact";
import { useContext, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { StoryContext } from "UI/Contexts/StoryContext";
import { Copy } from "Utils/TableUtil";
import StoryTool from "../UIUtils/StoryTool";

const ToolsList: ToolData[] = [
	{
		ButtonName: "Reload",
		Description: "Reload Story",
		RectOffset: new Vector2(128, 128),
		IconSize: UDim2.fromOffset(28, 28),
		OnClick: () => {
			print("Reload");
		},
	},
	{
		ButtonName: "Magnify",
		Description: "Zoom In",
		RectOffset: new Vector2(0, 0),
		OnClick: () => {
			print("Magnify");
		},
	},
	{
		ButtonName: "Minify",
		Description: "Zoom Out",
		RectOffset: new Vector2(64, 0),
		OnClick: () => {
			print("Minify");
		},
	},
	{
		ButtonName: "InViewport",
		Description: "View in Viewport",
		RectOffset: new Vector2(192, 0),
		Toggeable: true,
		OnClick: () => {
			print("InViewport");
		},
	},
	{
		ButtonName: "Explore",
		Description: "View in Exporer",
		RectOffset: new Vector2(192, 64),
		OnClick: () => {
			print("Explore");
		},
	},
];

export interface ToolData {
	RectOffset: Vector2;
	RectSize?: Vector2;
	ButtonName: string;
	Description: string;
	IconPos?: UDim2;
	IconSize?: UDim2;
	Toggeable?: boolean;
	OnClick: () => void;
}

interface StoryToolBarProps {}

function setProps(props: StoryToolBarProps) {
	return props;
}

function StoryToolBarCreate(setprops: StoryToolBarProps) {
	const props = setProps(setprops);
	const story = useContext(StoryContext).displayedNode;
	const ToolElements = useMemo<Array<Roact.Element>>(() => {
		const ReturnList: Array<Roact.Element> = [];
		ToolsList.forEach((tool, index) => {
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
		});
		return ReturnList;
	}, []);

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
