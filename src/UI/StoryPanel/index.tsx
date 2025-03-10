import React, { useCallback, useEffect } from "@rbxts/react";
import {
	useProducer,
	useSelector,
	useSelectorCreator
} from "@rbxts/react-reflex";
import { StoryPanelProvider } from "Context/StoryPanelContext";
import { useInputBegan } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { selectFullscreen } from "Reflex/Interface";
import { selectShortcutsEnabled } from "Reflex/PluginSettings";
import { selectPreview, selectStoryPreviews } from "Reflex/StoryPreview";
import { selectStorySelected } from "Reflex/StorySelection";
import { selectIsLightBackground } from "Reflex/Theme";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import BackgroundPattern from "./BackgroundPattern";
import FloatingStoryTitle from "./FloatingStoryTitle";
import PanelRender from "./PanelRender";
import StoryTitle from "./StoryTitle";

interface StoryContentsProps {}

function setProps(props: StoryContentsProps) {
	return props as Required<StoryContentsProps>;
}

function selectMaxOrder(state: RootState) {
	let max: number = -1;
	for (const [, entry] of state.storyPreview.mountPreviews) {
		max = math.max(max, entry.Order);
	}
	return max;
}

function selectStoryByOrder(
	previews: Map<string, PreviewEntry>,
	order: number
) {
	for (const [, entry] of previews) {
		if (entry.Order === order) {
			return entry;
		}
	}
}

function StoryContents(props: StoryContentsProps) {
	const theme = useTheme();
	const { selectStory, unmountByUID } = useProducer<RootProducer>();
	const previews = useSelector(selectStoryPreviews);
	const selectedEntry = useSelector(selectStorySelected);
	const entry = useSelectorCreator(selectPreview, selectedEntry);
	const maxOrder = useSelector(selectMaxOrder);
	const isLightColor = useSelector(selectIsLightBackground);
	const inputBegan = useInputBegan();
	const fullscreen = useSelector(selectFullscreen);
	const shortcutsEnabled = useSelector(selectShortcutsEnabled);

	const MoveNextPreview = useCallback(
		(delta: number) => {
			if (!entry) return;
			const newOrder = math.clamp(entry.Order + delta, 0, maxOrder);
			if (newOrder === entry.Order) return;

			const newPreview = selectStoryByOrder(previews, newOrder);
			if (!newPreview) return;
			selectStory(newPreview.UID);
		},
		[previews, entry]
	);

	useEffect(() => {
		if (!shortcutsEnabled) return;

		const connection = inputBegan.Connect((input) => {
			if (!input.IsModifierKeyDown(Enum.ModifierKey.Ctrl)) return;
			if (input.KeyCode === Enum.KeyCode.Left) {
				MoveNextPreview(-1);
			} else if (input.KeyCode === Enum.KeyCode.Right) {
				MoveNextPreview(1);
			}
		});

		return () => {
			connection.Disconnect();
		};
	}, [MoveNextPreview, entry, shortcutsEnabled]);

	return (
		<Div
			key="StoryContents"
			BackgroundTransparency={0}
			BackgroundColor3={
				theme.StoryPanel[isLightColor ? "LightColor" : "DarkColor"]
			}
			LayoutOrder={1}
		>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<BackgroundPattern />
			<Div key="StoryFrame">
				<TopList />
				<StoryPanelProvider>
					<PanelRender PreviewEntry={entry} />
				</StoryPanelProvider>
				{fullscreen ? <FloatingStoryTitle /> : <StoryTitle />}
			</Div>
		</Div>
	);
}

export default StoryContents;
