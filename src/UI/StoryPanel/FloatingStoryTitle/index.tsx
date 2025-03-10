import {
	useDebounceEffect,
	useSpring,
	useUpdateEffect
} from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectStorySelected } from "Reflex/StorySelection";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import { useRenderedMountEntries } from "../Utils";

interface FloatingStoryTitleProps {}

function FloatingStoryTitle(props: FloatingStoryTitleProps) {
	// array is used to make sure the dependency is re-updated
	const [shouldRender, setShouldRender] = useState([false]);
	const selectedStory = useSelector(selectStorySelected);
	const [scroller, setScroller] = useState<ScrollingFrame>();
	const entries = useRenderedMountEntries(scroller);

	const anchor = useSpring(shouldRender[0] ? 0 : 1, {
		tension: 100,
		friction: 10
	});

	useDebounceEffect(
		() => {
			if (!shouldRender[0]) return;
			print("should render", shouldRender[0]);
			setShouldRender([false]);
		},
		[shouldRender],
		{ wait: 0.9 }
	);

	useUpdateEffect(() => {
		setShouldRender([true]);
	}, [selectedStory]);

	return (
		<Div key={"FloatingStoryTitle"} Size={UDim2.fromScale(1, 0)}>
			<Div
				Size={new UDim2(1, 0, 0, 32)}
				AnchorPoint={anchor.map((a) => new Vector2(0, a))}
			>
				<Padding PaddingX={6} />
				<scrollingframe
					ScrollingEnabled={false}
					ScrollingDirection={Enum.ScrollingDirection.X}
					AutomaticCanvasSize={Enum.AutomaticSize.X}
					Size={UDim2.fromScale(1, 1)}
					CanvasSize={UDim2.fromScale(0, 0)}
					BorderSizePixel={0}
					BackgroundTransparency={1}
					ScrollBarThickness={0}
					ref={setScroller}
				>
					<LeftList
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
					<Padding Top={3} Bottom={4} />
					{entries}
				</scrollingframe>
			</Div>
		</Div>
	);
}

export default FloatingStoryTitle;
