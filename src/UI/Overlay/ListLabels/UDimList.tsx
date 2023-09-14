import Roact from "@rbxts/roact";

interface UDimListProps {
	Value: UDim;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: UDimListProps) {
	return props;
}
function Round(number: number) {
	return math.floor(number * 100) / 100;
}

export function UDimList(setprops: UDimListProps) {
	const props = setProps(setprops);

	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={"UDim"}
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
