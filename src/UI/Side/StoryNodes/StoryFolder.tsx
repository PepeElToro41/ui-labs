import Roact from "@rbxts/roact";
import StoryLabel from "./StoryLabel";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useContext, useEffect, useState, withHooksPure } from "@rbxts/roact-hooked";
import { Sprite } from "UI/UIUtils/Sprite";
import { Div } from "UI/UIUtils/Styles/Div";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Text } from "UI/UIUtils/Styles/Text";

interface StoryFolderProps {
	Key: string;
	//string | Instance because Storybooks-created folders are binded to real instances that arent tracked in any way, so name change needs to be listened
	DisplayName: string | Instance;
	LayoutOrder: number;
	Unknown?: boolean;
	Filter?: string;
	IsBook: boolean;
	Inside?: Array<StoryNode | FolderNode>;
	InsideElements?: Roact.Element[];
	DisplayedNode?: StoryNode;
	DisplayNode?: (node: StoryNode) => void;
}

function setProps(props: StoryFolderProps) {
	props.Unknown = props.Unknown ?? false;
	return props;
}

function StoryFolderCreate(setprops: StoryFolderProps) {
	const props = setProps(setprops) as Required<StoryFolderProps>;
	const [hover, setHover] = useState(false);
	const [expanded, expand] = useState(false);
	const [nameText, setNameText] = useState<string | undefined>();

	const theme = useContext(ThemeContext).Theme;
	const canExpand = props.InsideElements.size() > 0;
	useEffect(() => {
		let connection: RBXScriptConnection | undefined;
		if (typeIs(props.DisplayName, "Instance")) {
			const name = props.DisplayName.Name;
			setNameText(name);
			connection = props.DisplayName.GetPropertyChangedSignal("Name").Connect(() => {
				setNameText((props.DisplayName as Instance).Name);
			});
		} else if (typeIs(props.DisplayName, "string")) {
			setNameText(props.DisplayName);
		}
		return () => {
			if (connection) connection.Disconnect();
		};
	}, [props.DisplayName]);

	useEffect(() => {
		if (props.Filter && expanded === false) {
			expand(true);
		}
	}, [props.Filter]);
	return (
		<Div Key="StoryFolder" AutomaticSize={Enum.AutomaticSize.Y} Size={new UDim2(1, 0, 0, 25)} LayoutOrder={props.LayoutOrder}>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<Detector
				Key="EntryLabel"
				BackgroundColor3={theme.StoryIdle.Entry}
				LayoutOrder={0}
				BackgroundTransparency={hover ? 0.6 : 1}
				BorderColor3={Color3.fromRGB(27, 42, 53)}
				Size={new UDim2(1, 0, 0, 25)}
				Event={{
					MouseEnter: () => setHover(true),
					MouseLeave: () => setHover(false),
					MouseButton1Click: () => {
						expand((isExpanded) => {
							return !isExpanded;
						});
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uipadding
					PaddingBottom={new UDim(0, 5)}
					PaddingLeft={new UDim(0, 4)}
					PaddingRight={new UDim(0, 4)}
					PaddingTop={new UDim(0, 4)}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					Padding={new UDim(0, 5)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<Sprite
					Key="IconLabel"
					AnchorPoint={new Vector2(1, 0.5)}
					ImageColor3={
						props.IsBook
							? theme.StoryIdle.BookImage
							: props.Unknown
							? theme.StoryIdle.FolderDisabledImage
							: theme.StoryIdle.FolderImage
					}
					ImageRectOffset={props.IsBook ? new Vector2(192, 256) : new Vector2(0, 192)}
					LayoutOrder={1}
					Position={new UDim2(1, 0, 0.5, 0)}
					Size={new UDim2(1.08, 0, 1, 0)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
				/>
				<Text
					Key="TitleLabel"
					Text={nameText}
					LayoutOrder={2}
					Size={new UDim2(1, -46, 1, 0)}
					TextTruncate={Enum.TextTruncate.AtEnd}
					TextColor3={props.Unknown ? theme.TextDisabledColor : theme.TextColor}
					TextSize={14}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
				<Sprite
					Key="CollapseLabel"
					AnchorPoint={new Vector2(1, 0.5)}
					ImageColor3={canExpand ? theme.IconsColor : theme.IconsDisableColor}
					ImageRectOffset={expanded ? new Vector2(196, 128) : new Vector2(128, 64)}
					LayoutOrder={3}
					Position={new UDim2(1, 0, 0.5, 0)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
				/>
			</Detector>
			<Div Key="ChildrenFrame" LayoutOrder={1} AutomaticSize={Enum.AutomaticSize.Y} Size={UDim2.fromScale(1, 0)}>
				<frame
					Key="Divisor"
					BackgroundColor3={theme.Divisor}
					BackgroundTransparency={0.5}
					BorderSizePixel={0}
					Position={new UDim2(0, 8, 0, 0)}
					Size={new UDim2(0, 1, 1, -9)}
					Visible={expanded && props.InsideElements.size() > 0}
				/>
				<Div Key="Children" AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} Size={new UDim2(1, 0, 0, 0)}>
					<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
					<uipadding PaddingLeft={new UDim(0, 13)} />
					{expanded ? props.InsideElements : []}
				</Div>
			</Div>
		</Div>
	);
}
const StoryFolder = withHooksPure(StoryFolderCreate);

function CreateFolder(setprops: StoryFolderProps): Roact.Element | void {
	const props = setprops as Required<StoryFolderProps>;
	const InsideElements: Roact.Element[] = [];
	props.Inside.forEach((folder, index) => {
		if ("Inside" in folder) {
			//Creating Folder
			const newFolder = CreateFolder({
				Key: folder.DisplayName,
				DisplayName: folder.InstanceBinded ? folder.InstanceBinded : folder.DisplayName,
				LayoutOrder: index,
				Unknown: ("Unknown" in folder && folder.Unknown) ?? false,
				Filter: props.Filter,
				Inside: folder.Inside ?? [],
				IsBook: "BookBinded" in folder,
				DisplayedNode: props.DisplayedNode,
				DisplayNode: props.DisplayNode,
			});
			if (newFolder) {
				InsideElements.push(newFolder);
			}
		} else {
			//Creating Story
			let visible = true;
			if (props.Filter) {
				if (!folder.DisplayName.lower().match(props.Filter.lower())[0]) {
					visible = false;
				}
			}
			if (visible) {
				InsideElements.push(
					<StoryLabel
						Key={folder.DisplayName}
						DisplayName={folder.DisplayName}
						LayoutOrder={index}
						Unknown={folder.Unknown ?? props.Unknown ?? false}
						Visible={visible}
						StoryNode={folder}
						Displayed={props.DisplayedNode === folder}
						SelectNode={props.DisplayNode}
					></StoryLabel>,
				);
			}
		}
	});
	if (InsideElements.size() > 0 || props.Filter === undefined) {
		return (
			<StoryFolder
				Key={props.Key}
				DisplayName={props.DisplayName}
				LayoutOrder={props.LayoutOrder}
				Unknown={props.Unknown ?? false}
				Filter={props.Filter}
				IsBook={props.IsBook}
				InsideElements={InsideElements}
				DisplayedNode={props.DisplayedNode}
				DisplayNode={props.DisplayNode}
			/>
		);
	}
}

export = CreateFolder;
