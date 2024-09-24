import Vide, { cleanup, Source } from "@rbxts/vide";
import { useTheme } from "Contexts/ThemeProvider";
import { ExtractProp } from "Utils/Vide";

interface TextInputProps extends Vide.InstanceAttributes<TextBox> {
	Weight?: Enum.FontWeight["Name"];
	GetFocused?: Source<boolean>;
}

function TextInput(props: TextInputProps) {
	const theme = useTheme();
	const weight = ExtractProp(props, "Weight") ?? "Medium";
	const getFocused = ExtractProp(props, "GetFocused");

	const textbox = (
		<textbox
			Name={"TextInput"}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
			TextColor3={theme("Text")}
			FontFace={Font.fromName("GothamSSm", Enum.FontWeight[weight])}
			Text={""}
			TextSize={14}
			BorderSizePixel={0}
			{...props}
		>
			{props.children}
		</textbox>
	) as TextBox;

	if (getFocused) {
		cleanup(textbox.Focused.Connect(() => getFocused(true)));
		cleanup(textbox.FocusLost.Connect(() => getFocused(false)));
	}

	return textbox;
}

export default TextInput;
