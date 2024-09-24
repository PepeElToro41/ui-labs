import Vide, { Source } from "@rbxts/vide";
import { InstanceAttributes } from "@rbxts/vide";
import { ExtractProp } from "Utils/Vide";
import { ListenHovered } from "Utils/Vide/Actions";

interface DetectorProps extends InstanceAttributes<TextButton> {
	Hovered?: Source<boolean>;
}

function Detector(props: DetectorProps) {
	const hovered = ExtractProp(props, "Hovered");

	const button = (
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
	) as TextButton;

	if (hovered) {
		ListenHovered(hovered)(button);
	}

	return button;
}

export default Detector;
