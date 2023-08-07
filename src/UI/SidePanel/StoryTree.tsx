import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Detector from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";

interface StoryTreeProps {}

function setProps(props: StoryTreeProps) {
	return props as Required<StoryTreeProps>;
}

function StoryTreeCreate(setprops: StoryTreeProps) {
	const props = setProps(setprops as Required<StoryTreeProps>);
	return (
		<Detector Key="ScrollerFrame" Size={new UDim2(1, 0, 1, -65)} AnchorPoint={new Vector2(0.5, 0)} LayoutOrder={3}>
			<scrollingframe
				Key={"Scroller"}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={new UDim2()}
				ScrollBarThickness={3}
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			</scrollingframe>
		</Detector>
	);
}
const StoryTree = withHooks(StoryTreeCreate);

export = StoryTree;
