import React from "@rbxts/react";
import { Dictionary } from "@rbxts/sift";

interface DivProps extends React.InstanceProps<Frame> {
	Reference?: React.Ref<Frame>;
}

export function Div(props: DivProps) {
	const setRef = props.Reference;
	props.Reference = undefined;
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			BorderSizePixel={0}
			{...props}
			ref={setRef}
		></frame>
	);
}
