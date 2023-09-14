import Roact from "@rbxts/roact";

interface Vector2Props {
	Value: Vector2;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: Vector2Props) {
	return props;
}
function Round(number: number) {
	return math.floor(number * 100) / 100;
}

export function Vector2(setprops: Vector2Props) {
	const props = setProps(setprops);

	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={"Vector2"}
			TextColor3={props.Description ? props.Theme.TextDisabledColor : props.Theme.TextColor}
			TextSize={12}
			TextXAlignment={Enum.TextXAlignment.Right}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={UDim2.fromScale(0, 1)}
		/>
	);
}
