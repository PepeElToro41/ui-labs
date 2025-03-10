import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import {
	useProducer,
	useSelector,
	useSelectorCreator
} from "@rbxts/react-reflex";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import {
	useInputBegan,
	useInputEnded,
	useMouseOffset
} from "Hooks/Context/UserInput";
import { useIsOverlayBlocked } from "Hooks/Reflex/Use/OverlayBlock";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import Configs from "Plugin/Configs";
import { selectKeepViewOnViewport } from "Reflex/PluginSettings";
import { selectMountAmount, selectPreview } from "Reflex/StoryPreview";
import StoryDropdown from "UI/Overlays/Dropdown/StoryDropdown";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";
import { CreateInstancePath, EncodeInstancePath } from "Utils/InstanceUtils";

interface StoryProps {
	Node: StoryNode;
	Order: number;
	Unknown?: boolean;
	Visible?: boolean;
}

const TRANSPARENCY_INFO = new TweenInfo(
	0.3,
	Enum.EasingStyle.Quad,
	Enum.EasingDirection.Out
);

function setProps(props: StoryProps) {
	props.Visible = props.Visible ?? true;
	return props as Required<StoryProps>;
}

function Story(setprops: StoryProps) {
	const props = setProps(setprops);
	const [hovered, hoverApi] = useToggler(false);
	const [transparency, tweenTransparency, setTransparency] = useTween(
		TRANSPARENCY_INFO,
		1
	);
	const inputBegan = useInputBegan();
	const inputEnded = useInputEnded();

	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(
		props.Node.Module
	);
	const [ctrlDown, setCtrlDown] = useState(false);

	const { mountOnTop, toggleMount, setPopup, resetIdentifiedOverlay } =
		useProducer<RootProducer>();
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
		const connection1 = inputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftControl) {
				setCtrlDown(true);
			}
		});
		const connection2 = inputEnded.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftControl) {
				setCtrlDown(false);
			}
		});

		return () => {
			connection1.Disconnect();
			connection2.Disconnect();
		};
	}, []);

	useEffect(() => {
		if (selected) {
			tweenTransparency(0);
			return;
		}
		setTransparency(hovered ? 0.6 : 1);
	}, [hovered, selected]);

	const OnStorySelected = useCallback(() => {
		if (ctrlDown) {
			mountOnTop(props.Node.Module);
		} else {
			toggleMount(props.Node.Module, keepViewOnViewport);
		}
	}, [props.Node, keepViewOnViewport, ctrlDown]);

	const OnStoryDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup(
			"StoryDropdown",
			<StoryDropdown Position={offset} Node={props.Node} />,
			props.Node.Module
		);
	}, [mouseOffset, props.Node]);

	const textColor = selected ? theme.Text.Inverted : theme.Text.Color;

	useUnmountEffect(() => {
		resetIdentifiedOverlay(props.Node.Module);
	});

	return (
		<Div
			key={props.Node.Name}
			LayoutOrder={props.Order}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Div key={"Display"}>
				<Padding Left={14} Right={5} />
				<frame
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={theme[selected ? "StorySelected" : "Normal"].Color}
					BackgroundTransparency={transparency}
				>
					<Padding PaddingX={6} />
					<Corner Radius={6} />
					<LeftList
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, 6)}
					/>
					<Sprite
						key="Icon"
						Sprite={"StoryIcon"}
						ImageProps={{
							ImageColor3:
								theme[selected ? "StorySelected" : "Normal"].StoryIcon,
							Size: new UDim2(0, 16, 0, 18)
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
					MouseButton2Up: OnStoryDropdown
				}}
			/>
		</Div>
	);
}

export default Story;
