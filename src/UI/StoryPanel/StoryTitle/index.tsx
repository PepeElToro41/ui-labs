import React, { useState } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Divisor from "UI/Utils/Divisor";
import { useRenderedMountEntries } from "../Utils";

interface StoryTitleProps {}

function StoryTitle(props: StoryTitleProps) {
	const theme = useTheme();
	const [scroller, setScroller] = useState<ScrollingFrame>();
	const entries = useRenderedMountEntries(scroller);

	return (
		<frame
			key={"Title"}
			Size={new UDim2(1, 0, 0, 32)}
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
				ref={setScroller}
			>
				<LeftList
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 5)}
				/>
				<Padding PaddingX={6} Top={3} Bottom={4} />
				{entries}
			</scrollingframe>
		</frame>
	);
}

export default StoryTitle;
