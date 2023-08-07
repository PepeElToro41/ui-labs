import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface TextProps extends JSX.IntrinsicElement<TextLabel> {
	Weight?: Enum.FontWeight["Name"];
}

function TextCreate(props: TextProps) {
	const weight = props.Weight;
	props.Weight = undefined;
	const theme = useTheme();

	return (
		<textlabel
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 1)}
			TextColor3={theme.Text.Color}
			FontFace={Font.fromName("GothamSSm", (weight && Enum.FontWeight[weight]) ?? Enum.FontWeight.Medium)}
			TextSize={14}
			BorderSizePixel={0}
			{...props}
		></textlabel>
	);
}
const Text = withHooks(TextCreate);

export = Text;
