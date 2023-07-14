import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";

interface StringControlProps extends Control.ControlType<string> {}

function setProps(props: StringControlProps) {
	return props;
}

function StringControlCreate(setprops: StringControlProps) {
	const props = identity<Required<StringControlProps>>(setProps(setprops) as Required<StringControlProps>);

	const [input, setInput] = useState(props.Default);
	useUpdateEffect(() => {
		props.ControlApply(input);
	}, [input]);

	return (
		<frame
			Key="Entry"
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundColor3={Color3.fromRGB(56, 56, 56)}
			BorderSizePixel={0}
			Position={new UDim2(0, 0, 0.5, 0)}
			Size={new UDim2(1, -8, 0, 25)}
		>
			<uicorner CornerRadius={new UDim(0, 6)} />
			<textbox
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				ClearTextOnFocus={false}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
				PlaceholderText="Edit string..."
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, -20, 1, 0)}
				Text={input}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={12}
				TextXAlignment={Enum.TextXAlignment.Left}
				Event={{
					FocusLost: (input) => {
						setInput(input.Text);
					},
				}}
			/>
		</frame>
	);
}
const StringControl = withHooks(StringControlCreate);

export = StringControl;
