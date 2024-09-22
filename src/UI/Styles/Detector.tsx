import Vide from "@rbxts/vide";
import { InstanceAttributes } from "@rbxts/vide";

interface DetectorProps extends InstanceAttributes<TextButton> {}

function Detector(props: DetectorProps) {
	return (
		<textbutton
			BackgroundTransparency={1}
			TextTransparency={1}
			Text={""}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0, 0)}
			AutoButtonColor={false}
			{...props}
		>
			{props.children}
		</textbutton>
	);
}

export default Detector;
