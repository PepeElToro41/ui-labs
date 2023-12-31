import Roact from "@rbxts/roact";

interface BoolListProps {
	Value: boolean;
	Theme: Theme;
	Description: boolean;
}

function setProps(props: BoolListProps) {
	return props;
}

export function BoolList(setprops: BoolListProps) {
	const props = setProps(setprops);
	return (
		<textlabel
			Key={"Label"}
			FontFace={Font.fromEnum(Enum.Font.Gotham)}
			Text={props.Value ? "true" : "false"}
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
