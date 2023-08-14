import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import StoryName from "./StoryName";
import StoryPath from "./StoryPath";
import Divisor from "UI/Utils/Divisor";
import Div from "UI/Styles/Div";
import List from "UI/Styles/List";
import LeftList from "UI/Styles/List/LeftList";
import { useSelector } from "@rbxts/roact-reflex";
import { selectStoryDisplay } from "Reflex/StorySelect/StoryDisplay";

interface StoryTitleProps {}

function setProps(props: StoryTitleProps) {
	return props as Required<StoryTitleProps>;
}

function StoryTitleCreate(setprops: StoryTitleProps) {
	const props = setProps(setprops as Required<StoryTitleProps>);

	const theme = useTheme();
	const { selected } = useSelector(selectStoryDisplay);

	return (
		<frame Key="StoryTitle" BackgroundColor3={theme.StoryTitle.Color} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 35)}>
			<Divisor
				Direction="X"
				Anchor={0}
				Thickness={2}
				Transparency={0.5}
				Position={UDim2.fromScale(0, 1)}
				Size={new UDim(1, 0)}
				ZIndex={2}
			/>
			<Div Key="Title" Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)} Size={new UDim2(1, -30, 1, 0)}>
				<LeftList Padding={new UDim(0, 15)} VerticalAlignment={Enum.VerticalAlignment.Center} />
				<StoryName />
				<Divisor Direction="Y" Size={new UDim(0.5, 0)} Order={1} Visible={selected !== undefined} />
				<StoryPath />
			</Div>
		</frame>
	);
}
const StoryTitle = withHooks(StoryTitleCreate);

export = StoryTitle;
