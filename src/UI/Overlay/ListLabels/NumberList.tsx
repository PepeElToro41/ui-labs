import Roact from "@rbxts/roact";

interface NumberListProps {
	Value: number;
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
			TextColor3={Color3.fromRGB(168, 168, 168)}
			TextSize={12}
			TextXAlignment={Enum.TextXAlignment.Right}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={UDim2.fromScale(0, 1)}
		/>
	);
}
