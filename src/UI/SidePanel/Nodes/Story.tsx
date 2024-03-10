import React, { useCallback, useEffect } from "@rbxts/react";
import { useProducer, useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Corner from "UI/Styles/Corner";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";
import { useToggler } from "Hooks/Utils/Toggler";
import StoryDropdown from "UI/Overlays/Dropdown/StoryDropdown";
import { usePosition } from "Hooks/Utils/AppHolder";
import { useMouseOffset, useMousePos } from "Hooks/Context/UserInput";
import { useIsOverlayBlocked } from "Hooks/Reflex/Use/OverlayBlock";
import { selectMountAmount, selectPreview } from "Reflex/StoryPreview/StoryMount";
import Configs from "Plugin/Configs";

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

function Story(setprops: StoryProps) {
	const props = setProps(setprops);

	const [hovered, hoverApi] = useToggler(false);
	const [transparency, tweenTransparency, setTransparency] = useTween(TRANSPARENCY_INFO, 1);

	const { toggleMount, setOverlay } = useProducer<RootProducer>();
	const rootStory = useSelectorCreator(selectPreview, Configs.RootPreviewKey);
	const mountAmount = useSelectorCreator(selectMountAmount, props.Node.Module);

	const theme = useTheme();
	const mouseOffset = useMouseOffset();
	const isBlocked = useIsOverlayBlocked();

	const selected = rootStory ? rootStory.Module === props.Node.Module : false;

	useEffect(() => {
		if (hovered && isBlocked) {
			hoverApi.disable();
		}
	}, [hovered, isBlocked]);

	useEffect(() => {
		if (selected) {
			tweenTransparency(0);
			return;
		}
		setTransparency(hovered ? 0.6 : 1);
	}, [hovered, selected]);

	const OnStorySelected = useCallback(() => toggleMount(props.Node.Module), [props.Node]);
	const OnStoryDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setOverlay("StoryDropdown", <StoryDropdown Position={offset} Node={props.Node} />);
	}, [mouseOffset, props.Node]);

	const textColor = selected
		? theme.Nodes.StorySelected.Text[props.Unknown ? "Disabled" : "Color"]
		: theme.Text[props.Unknown ? "Disabled" : "Color"];

	return (
		<frame
			key={props.Node.Name}
			LayoutOrder={props.Order}
			BackgroundColor3={theme.Nodes[selected ? "StorySelected" : "Normal"][props.Unknown ? "Disabled" : "Color"]}
			BackgroundTransparency={transparency}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Corner Radius={6} />
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: OnStorySelected,
					MouseButton2Click: OnStoryDropdown,
				}}
			/>
			{mountAmount > 0 && (
				<Div>
					<Text
						Position={new UDim2(1, -10, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						Size={UDim2.fromScale(1, 1)}
						Text={tostring(mountAmount)}
						TextSize={12}
						TextColor3={textColor}
						TextXAlignment={Enum.TextXAlignment.Right}
					/>
				</Div>
			)}
			<Div>
				<Padding Padding={4} Bottom={5} />
				<LeftList Padding={new UDim(0, 5)} />
				<Sprite
					key="IconLabel"
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
					key="NameLabel"
					Text={props.Node.Name}
					LayoutOrder={2}
					TextColor3={textColor}
					Size={new UDim2(1, -25, 1, 0)}
					TextTruncate={Enum.TextTruncate.AtEnd}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Div>
		</frame>
	);
}

export default Story;
