import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { selectStoryDisplay } from "Reflex/StorySelect/StoryDisplay";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";

interface StoryNameProps {}

function setProps(props: StoryNameProps) {
	return props as Required<StoryNameProps>;
}

function StoryNameCreate(setprops: StoryNameProps) {
	const props = setProps(setprops as Required<StoryNameProps>);
	const { selected } = useSelector(selectStoryDisplay);
	return (
		<Text
			Key="StoryName"
			Weight="Bold"
			Size={new UDim2(0, 0, 0, 20)}
			AutomaticSize={Enum.AutomaticSize.X}
			Text={(selected && selected.Name) ?? "---"}
			TextSize={20}
			TextXAlignment={Enum.TextXAlignment.Left}
		/>
	);
}
const StoryName = withHooks(StoryNameCreate);

export = StoryName;
