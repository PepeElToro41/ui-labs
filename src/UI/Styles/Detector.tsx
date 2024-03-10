import React from "@rbxts/react";

interface DetectorProps extends React.InstanceProps<TextButton> {}

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
