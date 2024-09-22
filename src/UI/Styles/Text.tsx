import Vide from "@rbxts/vide";
import { useTheme } from "Contexts/ThemeProvider";

interface TextProps extends Vide.InstanceAttributes<TextLabel> {
	Weight?: Enum.FontWeight["Name"];
}

function Text(props: TextProps) {
	const theme = useTheme();

	const weight = props.Weight ?? "Medium";
	props.Weight = undefined;

	return (
		<textlabel
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 1)}
			TextColor3={theme("Text")}
			FontFace={Font.fromName("GothamSSm", Enum.FontWeight[weight])}
			TextSize={14}
			BorderSizePixel={0}
			{...props}
		>
			{props.children}
		</textlabel>
	);
}

export default Text;
