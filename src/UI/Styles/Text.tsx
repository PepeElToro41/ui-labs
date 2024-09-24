import Vide from "@rbxts/vide";
import { useTheme } from "Contexts/ThemeProvider";
import { ExtractProp } from "Utils/Vide";
import Padding from "./Padding";

interface TextProps extends Vide.InstanceAttributes<TextLabel> {
	Weight?: Enum.FontWeight["Name"];
	Padding?: number;
}

function Text(props: TextProps) {
	const theme = useTheme();
	const weight = ExtractProp(props, "Weight") ?? "Medium";
	const padding = ExtractProp(props, "Padding");

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
			{padding !== undefined ? <Padding Padding={padding} /> : undefined}
			{props.children}
		</textlabel>
	);
}

export default Text;
