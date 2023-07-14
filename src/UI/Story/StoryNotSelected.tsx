import Roact from "@rbxts/roact";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

interface StoryNotSelectedProps {
	Visible: boolean;
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
			BackgroundColor3={new Color3(0, 0, 0)}
		>
			<Text
				Key={"SelectWarn"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, 50)}
				Text="Select a Story"
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={25}
			/>
		</Div>
	);
}
