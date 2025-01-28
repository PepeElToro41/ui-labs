import React, { useCallback, useEffect, useMemo } from "@rbxts/react";
import { useProducer, useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Text from "UI/Styles/Text";
import { useToggler } from "Hooks/Utils/Toggler";
import StoryDropdown from "UI/Overlays/Dropdown/StoryDropdown";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { useIsOverlayBlocked } from "Hooks/Reflex/Use/OverlayBlock";
import { selectMountAmount, selectPreview } from "Reflex/StoryPreview";
import Configs from "Plugin/Configs";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { CreateInstancePath, EncodeInstancePath } from "Utils/InstanceUtils";
import { selectKeepViewOnViewport } from "Reflex/PluginSettings";
import Padding from "UI/Styles/Padding";
import Corner from "UI/Styles/Corner";
import LeftList from "UI/Styles/List/LeftList";
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

function Story(setprops: StoryProps) {
	const props = setProps(setprops);
	const [hovered, hoverApi] = useToggler(false);
	const [transparency, tweenTransparency, setTransparency] = useTween(TRANSPARENCY_INFO, 1);
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(props.Node.Module);

	const { toggleMount, setPopup, resetIdentifiedOverlay } = useProducer<RootProducer>();
	const keepViewOnViewport = useSelector(selectKeepViewOnViewport);
	const rootStory = useSelectorCreator(selectPreview, Configs.RootPreviewKey);
	const mountAmount = useSelectorCreator(selectMountAmount, props.Node.Module);

	const module = props.Node.Module;
	const theme = useTheme();
	const mouseOffset = useMouseOffset();
	const isBlocked = useIsOverlayBlocked();
	const referencePath = useMemo(() => CreateInstancePath(module), [props.Node]);
	const selected = rootStory ? rootStory.Module === module : false;

	useEffect(() => {
		if (hovered && isBlocked) {
			hoverApi.disable();
		}
	}, [hovered, isBlocked]);
	useEffect(() => {
		if (hovered && referencePath) {
			DisplayDescription(EncodeInstancePath(referencePath));
		} else {
			RemoveDescription();
		}
	}, [referencePath, hovered]);

	useEffect(() => {
		if (selected) {
			tweenTransparency(0);
			return;
		}
		setTransparency(hovered ? 0.6 : 1);
	}, [hovered, selected]);

	const OnStorySelected = useCallback(() => toggleMount(props.Node.Module, keepViewOnViewport), [props.Node, keepViewOnViewport]);
	const OnStoryDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup("StoryDropdown", <StoryDropdown Position={offset} Node={props.Node} />, props.Node.Module);
	}, [mouseOffset, props.Node]);

	const textColor = selected ? theme.Text.Inverted : theme.Text.Color;

	useUnmountEffect(() => {
		resetIdentifiedOverlay(props.Node.Module);
	});

	return (
		<Div key={props.Node.Name} LayoutOrder={props.Order} Size={new UDim2(1, 0, 0, 25)}>
			<Div key={"Display"}>
				<Padding Left={14} Right={5} />
				<frame
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={theme[selected ? "StorySelected" : "Normal"].Color}
					BackgroundTransparency={transparency}
				>
					<Padding PaddingX={6} />
					<Corner Radius={6} />
					<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 6)} />
					<Sprite
						key="Icon"
						Sprite={"StoryIcon"}
						ImageProps={{
							ImageColor3: theme[selected ? "StorySelected" : "Normal"].StoryIcon,
							Size: new UDim2(0, 16, 0, 18),
						}}
					/>
					<Text
						Size={new UDim2(1, -19, 1, 0)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Text={props.Node.Name}
						TextColor3={textColor}
						AutomaticSize={Enum.AutomaticSize.X}
					/>
				</frame>
				{mountAmount > 0 && (
					<Div key={"MountAmount"}>
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
			</Div>
			<frame
				key={"Divider"}
				Size={UDim2.fromOffset(8, 1)}
				Position={new UDim2(0, -6, 0.5, 0)}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={theme.Text.Color}
				BackgroundTransparency={0.8}
				BorderSizePixel={0}
			/>
			<imagelabel
				key={"Dot"}
				Image={"rbxassetid://90763872297559"}
				ImageColor3={theme.Text.Color}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(6, 6)}
				Position={new UDim2(0, 8, 0.5, 0)}
				ImageTransparency={0.8}
				AnchorPoint={new Vector2(0, 0.5)}
			/>
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: OnStorySelected,
					MouseButton2Up: OnStoryDropdown,
				}}
			/>
		</Div>
	);
}

export default Story;
