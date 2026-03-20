import React, { useCallback, useEffect, useRef } from "@rbxts/react";
import { PrimitiveControl } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import InputBase from "UI/Utils/InputBase";
import { ApplyFilters } from "Utils/StringUtils";

function StringControl(props: ControlElementProps<PrimitiveControl<"String">>) {
	const textRef = useRef<TextBox>();

	useEffect(() => {
		const textbox = textRef.current;
		if (!textbox) return;

		textbox.Text = props.Current;
	}, [props.Current, textRef.current]);

	const OnTextChanged = useCallback(
		(textbox: TextBox) => {
			const text = ApplyFilters(textbox.Text, props.Control.Filters ?? []);
			textbox.Text = text;
		},
		[props.Control]
	);
	const OnFocusLost = useCallback(
		(textbox: TextBox) => {
			const text = ApplyFilters(textbox.Text, props.Control.Filters ?? []);

			if (text === props.Current) return;
			props.Apply(text);
		},
		[props.Control, props.Apply, props.Current]
	);

	return (
		<Div>
			<Padding PaddingY={4} />
			<InputBase
				TextboxProps={{
					PlaceholderText: "Edit string...",
					TextSize: 13,
					ClearTextOnFocus: false
				}}
				OnTextChanged={OnTextChanged}
				OnFocusLost={OnFocusLost}
				Reference={textRef}
			/>
		</Div>
	);
}

export default StringControl;
