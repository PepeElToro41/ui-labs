import Vide from "@rbxts/vide";
import { InstanceAttributes } from "@rbxts/vide";

interface FrameProps extends InstanceAttributes<Frame> {}

function Frame(props: FrameProps) {
	return (
		<frame
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

export default Frame;
