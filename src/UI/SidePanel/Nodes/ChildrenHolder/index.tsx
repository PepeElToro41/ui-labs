import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { selectFilter } from "Reflex/Explorer/Filter";
import Detector from "UI/Styles/Detector";
import Div from "UI/Styles/Div";
import List from "UI/Styles/List";
import Corner from "UI/Styles/Corner";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface ChildrenHolderProps {
	Name: string | Instance;
	Order: number;
	Sprite: SpriteName;
	SpriteColor: Color3;
	Unknown?: boolean;
	Children: Roact.Element[];
}

const EXPAND_INFO = new TweenInfo(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

function setProps(props: ChildrenHolderProps) {
	return props as Required<ChildrenHolderProps>;
}

function GetName(name: string | Instance) {
	if (typeIs(name, "string")) return name;
	else return name.Name;
}

function ChildrenHolderCreate(setprops: ChildrenHolderProps) {
	const props = setProps(setprops as Required<ChildrenHolderProps>);
	const theme = useTheme();

	const [hovered, setHover] = useState(false);
	const [expanded, expand] = useState(false);
	const [name, setName] = useState<string>(GetName(props.Name));
	const [expandSize, tweenExpandSize] = useTween(EXPAND_INFO, 0);
	const [expandVisible, setExpandVisible] = useState(false);

	const filter = useSelector(selectFilter).search;

	useEffect(() => {
		if (typeIs(props.Name, "string")) {
			setName(props.Name);
			return;
		}
		const connection = props.Name.GetPropertyChangedSignal("Name").Connect(() => {
			setName((props.Name as Instance).Name);
		});
		return () => connection.Disconnect();
	}, [props.Name]);

	useEffect(() => {
		const tweener = tweenExpandSize(expanded ? 0 : 1);
		let tweenerConnection: RBXScriptConnection;
		if (expanded) {
			setExpandVisible(true);
		} else {
			tweenerConnection = tweener.Completed.Connect(() => {
				setExpandVisible(expanded);
			});
		}
		return () => tweenerConnection && tweenerConnection.Disconnect();
	}, [expanded]);

	useEffect(() => {
		if (filter) expand(true);
	}, [filter]);

	return (
		<Div Key={name} AutomaticSize={Enum.AutomaticSize.Y} Size={new UDim2(1, 0, 0, 25)} LayoutOrder={props.Order}>
			<List />
			<frame
				Key="EntryLabel"
				BackgroundColor3={theme.Nodes.Normal.Color}
				LayoutOrder={0}
				BackgroundTransparency={hovered ? 0.6 : 1}
				Size={new UDim2(1, 0, 0, 25)}
			>
				<Corner Size={6} />
				<Detector
					ZIndex={4}
					Event={{
						MouseEnter: () => setHover(true),
						MouseLeave: () => setHover(false),
						MouseButton1Click: () => expand((isExpanded) => !isExpanded),
					}}
				/>
				<Div>
					<LeftList Padding={new UDim(0, 5)} />
					<Padding Padding={4} ExtraPadding={{ PaddingBottom: new UDim(0, 5) }} />
					<Sprite
						Key="Icon"
						Sprite={props.Sprite}
						ImageProps={{
							LayoutOrder: 1,
							ImageColor3: props.SpriteColor,
							Size: new UDim2(0, 16, 0, 16),
						}}
					/>
					<Text
						Key="TitleLabel"
						Text={name}
						LayoutOrder={2}
						Size={new UDim2(1, -46, 1, 0)}
						TextTruncate={Enum.TextTruncate.AtEnd}
						TextColor3={props.Unknown ? theme.Text.Disabled : theme.Text.Color}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<Sprite
						Key="ExpandIcon"
						Sprite={expanded ? "Collapse" : "Expand"}
						ImageProps={{
							LayoutOrder: 3,
							ImageColor3: props.Unknown ? theme.Icon.Disabled : theme.Icon.Color,
							Size: new UDim2(0, 16, 0, 16),
						}}
					/>
				</Div>
			</frame>
			<Div
				Key="ChildrenFrame"
				ClipsDescendants={true}
				LayoutOrder={1}
				AutomaticSize={Enum.AutomaticSize.Y}
				Size={UDim2.fromScale(1, 0)}
			>
				<frame
					Key="ChildrenDivisor"
					BackgroundColor3={theme.Divisor.Color}
					BackgroundTransparency={0.5}
					BorderSizePixel={0}
					Position={new UDim2(0, 8, 0, 0)}
					Size={new UDim2(0, 1, 1, -9)}
					Visible={props.Children.size() > 0 && expandVisible}
				/>
				<Div
					Key="Children"
					AutomaticSize={Enum.AutomaticSize.Y}
					AnchorPoint={expandSize.map((size) => new Vector2(0, size))}
					LayoutOrder={2}
					Size={new UDim2(1, 0, 0, 0)}
					Visible={expandVisible}
				>
					<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
					<uipadding PaddingLeft={new UDim(0, 13)} />
					{expandVisible ? props.Children : []}
				</Div>
			</Div>
		</Div>
	);
}
const ChildrenHolder = withHooks(ChildrenHolderCreate);

export = ChildrenHolder;
