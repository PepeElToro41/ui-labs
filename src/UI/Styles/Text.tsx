import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface TextProps extends React.InstanceAttributes<TextLabel> {
	Weight?: Enum.FontWeight["Name"];
}

function Text(props: TextProps) {
	const weight = props.Weight ?? "Medium";
	props.Weight = undefined;
	const theme = useTheme();
	return (
		<textlabel
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 1)}
			TextColor3={theme.Text.Color}
			FontFace={Font.fromName("GothamSSm", Enum.FontWeight[weight])}
			TextSize={14}
			BorderSizePixel={0}
			{...props}
		></textlabel>
	);
}

export default Text;
