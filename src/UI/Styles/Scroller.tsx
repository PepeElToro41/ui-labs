import Vide from "@rbxts/vide";

interface ScrollerProps extends Vide.InstanceAttributes<ScrollingFrame> {}

function Scroller(props: ScrollerProps) {
	return (
		<scrollingframe
			Name={"Scroller"}
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			BorderSizePixel={0}
			ScrollBarThickness={2}
			CanvasSize={UDim2.fromScale(0, 0)}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			{...props}
		>
			{props.children}
		</scrollingframe>
	);
}

export default Scroller;
