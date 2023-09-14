import Roact from "@rbxts/roact";

interface Vector3Props {
	Value: Vector3;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: Vector3Props) {
	return props;
}

function Round(setNumber: number) {
	return math.floor(setNumber * 100) / 100;
}

export function Vector3(setprops: Vector3Props) {
	const props = setProps(setprops);

	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={"Vector3"}
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
