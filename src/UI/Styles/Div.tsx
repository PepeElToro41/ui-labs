import Vide from "@rbxts/vide";
import { InstanceAttributes } from "@rbxts/vide";

interface DivProps extends InstanceAttributes<Frame> {}

function Div(props: DivProps) {
	return (
		<frame
			BackgroundTransparency={1}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			Size={UDim2.fromScale(1, 1)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 0)}
			{...props}
		>
			{props.children}
		</frame>
	);
}

export default Div;
