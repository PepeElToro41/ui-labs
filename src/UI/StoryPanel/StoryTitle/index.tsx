import React, { useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import MountEntry from "./MountEntry";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Divisor from "UI/Utils/Divisor";
import { selectFullscreen } from "Reflex/Interface";

interface StoryTitleProps {}

function StoryTitle(props: StoryTitleProps) {
	const theme = useTheme();
	const mounts = useSelector(selectStoryPreviews);
	const fullscreen = useSelector(selectFullscreen);

	const entries = useMemo(() => {
		const elements: ReactChildren = new Map();

		mounts.forEach((entry, key) => {
			elements.set(key, <MountEntry PreviewEntry={entry} />);
		});
		return elements;
	}, [mounts]);

	return (
		<frame
			key={"Title"}
			Size={new UDim2(1, 0, 0, 32)}
			Visible={!fullscreen}
			ZIndex={3}
			BackgroundColor3={theme.StoryPreview.Background}
			BorderSizePixel={0}
		>
			<Divisor
				Direction="X"
				Anchor={0}
				Thickness={1}
				Transparency={0.5}
				Position={new UDim2(0, 0, 1, -1)}
				Size={new UDim(1, 0)}
				ZIndex={2}
			/>
			<scrollingframe
				Size={UDim2.fromScale(1, 1)}
				CanvasSize={UDim2.fromScale(0, 0)}
				ScrollingDirection={Enum.ScrollingDirection.X}
				AutomaticCanvasSize={Enum.AutomaticSize.X}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={1}
				ScrollBarImageTransparency={0.5}
			>
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 5)} />
				<Padding PaddingX={6} Top={3} Bottom={4} />
				{entries}
			</scrollingframe>
		</frame>
	);
}

export default StoryTitle;
