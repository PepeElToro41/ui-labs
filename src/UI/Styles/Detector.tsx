import React, { forwardRef } from "@rbxts/react";

interface DetectorProps extends React.InstanceProps<TextButton> {}

export const Detector = forwardRef<TextButton, DetectorProps>((props, ref) => {
	return (
		<textbutton
			BackgroundTransparency={1}
			TextTransparency={1}
			Text={""}
			Size={new UDim2(1, 0, 1, 0)}
			AutoButtonColor={false}
			ref={ref}
			{...props}
		></textbutton>
	);
});
