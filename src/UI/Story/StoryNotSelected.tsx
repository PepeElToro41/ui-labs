import Roact from "@rbxts/roact";
import { useContext } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

interface StoryNotSelectedProps {
	Visible: boolean;
	Theme: Theme;
}

function setProps(props: StoryNotSelectedProps) {
	return props;
}

export function StoryNotSelected(setprops: StoryNotSelectedProps) {
	const props = setProps(setprops);
	return (
		<Div
			Key={"StoryNotSelected"}
			ZIndex={2}
			Visible={props.Visible}
			BackgroundTransparency={0.5}
			BackgroundColor3={props.Theme.PureColor}
		>
			<Text
				Key={"SelectWarn"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, 50)}
				Text="Select a Story"
				TextColor3={props.Theme.TextColor}
				TextSize={25}
			/>
		</Div>
	);
}
