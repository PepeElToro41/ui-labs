import Roact from "@rbxts/roact";
import { useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { useProducer, useSelector } from "@rbxts/roact-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { selectStoryDisplay } from "Reflex/StorySelect/StoryDisplay";
import Detector from "UI/Styles/Detector";
import Div from "UI/Styles/Div";
import Corner from "UI/Styles/Corner";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface StoryProps {
	Node: StoryNode;
	Order: number;
	Unknown?: boolean;
	Visible?: boolean;
}

const TRANSPARENCY_INFO = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

function setProps(props: StoryProps) {
	props.Visible = props.Visible ?? true;
	return props as Required<StoryProps>;
}

function StoryCreate(setprops: StoryProps) {
	const props = setProps(setprops as Required<StoryProps>);
	const [hovered, setHover] = useState(false);
	const displayedNode = useSelector(selectStoryDisplay).selected;
	const { selectStory } = useProducer<RootProducer>();
	const [transparency, tweenTransparency, setTransparency] = useTween(TRANSPARENCY_INFO, 1);
	const selected = displayedNode && displayedNode.Module === props.Node.Module;
	useEffect(() => {
		if (selected) {
			tweenTransparency(0);
			return;
		}
		setTransparency(hovered ? 0.6 : 1);
	}, [hovered, selected]);

	const theme = useTheme();
	return (
		<frame
			Key={props.Node.Name}
			BackgroundColor3={theme.Nodes[selected ? "StorySelected" : "Normal"][props.Unknown ? "Disabled" : "Color"]}
			BackgroundTransparency={transparency}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Corner Size={6} />
			<Detector
				Event={{
					MouseEnter: () => setHover(true),
					MouseLeave: () => setHover(false),
					MouseButton1Click: () => selectStory(props.Node),
				}}
			/>
			<Div>
				<Padding Padding={4} ExtraPadding={{ PaddingBottom: new UDim(0, 5) }} />
				<LeftList Padding={new UDim(0, 5)} />
				<Sprite
					Key="IconLabel"
					Sprite="StoryIcon"
					ImageProps={{
						AnchorPoint: new Vector2(1, 0.5),
						ImageColor3: theme.Nodes[selected ? "StorySelected" : "Normal"].StoryIcon[props.Unknown ? "Disabled" : "Color"],
						Position: new UDim2(1, 0, 0.5, 0),
						Size: new UDim2(1, 0, 1.1, 0),
						LayoutOrder: 1,
						SizeConstraint: Enum.SizeConstraint.RelativeYY,
					}}
				/>
				<Text
					Key="NameLabel"
					Text={props.Node.Name}
					LayoutOrder={2}
					TextColor3={
						selected
							? theme.Nodes.StorySelected.Text[props.Unknown ? "Disabled" : "Color"]
							: theme.Text[props.Unknown ? "Disabled" : "Color"]
					}
					Size={new UDim2(1, -25, 1, 0)}
					TextTruncate={Enum.TextTruncate.AtEnd}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Div>
		</frame>
	);
}
const Story = withHooks(StoryCreate);

export = Story;
