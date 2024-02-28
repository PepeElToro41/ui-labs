import Roact, { useMemo } from "@rbxts/roact";
import { useSelector } from "@rbxts/react-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview/StoryMount";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import MountEntry from "./MountEntry";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Divisor from "UI/Utils/Divisor";

interface StoryTitleProps {}

function StoryTitle(props: StoryTitleProps) {
	const mounts = useSelector(selectStoryPreviews);
	const theme = useTheme();

	const entries = useMemo(() => {
		const elements: Roact.Children = new Map();

		mounts.forEach((entry, key) => {
			elements.set(key, <MountEntry PreviewEntry={entry} />);
		});
		return elements;
	}, [mounts]);

	return (
		<frame Key={"Title"} Size={new UDim2(1, 0, 0, 31)} ZIndex={3} BackgroundColor3={theme.StoryPreview.Background} BorderSizePixel={0}>
			<Divisor
				Direction="X"
				Anchor={0}
				Thickness={1}
				Transparency={0.5}
				Position={UDim2.fromScale(0, 1)}
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
