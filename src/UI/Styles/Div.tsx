import React from "@rbxts/react";

interface DivProps extends React.InstanceProps<Frame> {}

export const Div = React.forwardRef<Frame, DivProps>((props, ref) => {
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			BorderSizePixel={0}
			ref={ref}
			{...props}
		></frame>
	);
});
