import Roact from "@rbxts/roact";

interface UDim2ListProps {
	Value: UDim2;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: UDim2ListProps) {
	return props;
}
function Round(number: number) {
	return math.floor(number * 100) / 100;
}

export function UDim2List(setprops: UDim2ListProps) {
	const props = setProps(setprops);

	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={"UDim2"}
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
