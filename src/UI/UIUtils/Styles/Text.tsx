import Roact from "@rbxts/roact";

interface TextProps extends JSX.IntrinsicElement<TextLabel> {}

function setProps(props: TextProps) {
	return props;
}

export function Text(setprops: TextProps) {
	const props = setProps(setprops);
	return (
		<textlabel
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 1)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
			TextSize={14}
			BorderSizePixel={0}
			{...props}
		></textlabel>
	);
}
