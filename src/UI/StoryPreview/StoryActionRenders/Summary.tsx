import Roact from "@rbxts/roact";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface SummaryProps {
	SummaryText: string;
}

function setProps(props: SummaryProps) {
	return props as Required<SummaryProps>;
}

function Summary(setprops: SummaryProps) {
	const props = setProps(setprops);

	return (
		<Div Key={"SummaryAction"}>
			<Padding Padding={10} />
			<scrollingframe
				Key={"Summary"}
				BackgroundTransparency={1}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
			>
				<Text
					RichText={true}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextSize={14}
					Size={UDim2.fromScale(1, 0)}
					Text={props.SummaryText}
					TextXAlignment={Enum.TextXAlignment.Left}
					Weight="Light"
				/>
			</scrollingframe>
		</Div>
	);
}

export default Summary;
