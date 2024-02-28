import Roact from "@rbxts/roact";

interface DetectorProps extends JSX.IntrinsicElement<TextButton> {}

export function Detector(props: DetectorProps) {
	return (
		<textbutton
			BackgroundTransparency={1}
			TextTransparency={1}
			Text={""}
			Size={new UDim2(1, 0, 1, 0)}
			AutoButtonColor={false}
			{...props}
		></textbutton>
	);
}
