import Roact from "@rbxts/roact";

interface DivProps extends JSX.IntrinsicElement<Frame> {}

export function Div(props: DivProps) {
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			BorderSizePixel={0}
			{...props}
		></frame>
	);
}
