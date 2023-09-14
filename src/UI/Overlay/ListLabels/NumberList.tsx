import Roact from "@rbxts/roact";

interface NumberListProps {
	Value: number;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: NumberListProps) {
	return props;
}

export function NumberList(setprops: NumberListProps) {
	const props = setProps(setprops);
	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={tostring(props.Value)}
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
