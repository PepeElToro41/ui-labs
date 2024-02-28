import Roact from "@rbxts/roact";
import Text from "UI/Styles/Text";

interface TextRendererProps {
	Text: string;
	IsDescription: boolean;
}

function setProps(props: TextRendererProps) {
	return props;
}

function TextRenderer(setprops: TextRendererProps) {
	const props = setProps(setprops);
	return (
		<Text
			Text={props.Text}
			TextSize={12}
			Size={UDim2.fromScale(0, 1)}
			TextTruncate={Enum.TextTruncate.AtEnd}
			TextTransparency={props.IsDescription ? 0.4 : 0}
			AutomaticSize={Enum.AutomaticSize.X}
			TextXAlignment={Enum.TextXAlignment[props.IsDescription ? "Right" : "Left"]}
		>
			<uisizeconstraint MinSize={new Vector2(70, 0)} MaxSize={new Vector2(323, math.huge)} />
		</Text>
	);
}

export default TextRenderer;
