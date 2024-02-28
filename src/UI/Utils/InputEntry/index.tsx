import Roact, { PropsWithChildren, useCallback } from "@rbxts/roact";
import { Filter } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import InputBase from "../InputBase";
import { ApplyFilters } from "Utils/StringUtils";
import { Decoders } from "./Decoders";
import { Parsers } from "./Parsers";

type Parser<T> = (val: T) => string;
type Decoder<T> = (input: string) => T | undefined;

interface InputEntryProps<T> extends PropsWithChildren {
	TextboxProps?: Roact.JsxInstanceProperties<TextBox>;
	HolderProps?: Roact.JsxInstanceProperties<Frame>;
	CornerRadius?: number;

	Value: T;
	Apply: (value: T) => void;

	Parser?: Parser<T>;
	Decoder?: Decoder<T>;
	Filters?: Filter[];

	Sprite?: SpriteName;
	MaintainValue?: boolean;
	OnTextChanged?: (textbox: TextBox) => void;
	OnFocused?: (textbox: TextBox) => void;
	OnFocusLost?: (textbox: TextBox, enter: boolean) => void;
}

function InputEntry<T>(props: InputEntryProps<T>) {
	const filters = props.Filters ?? [];
	const parser = props.Parser ?? Parsers.Default;
	const decoder = props.Decoder ?? Decoders.Default;

	const OnFocusLost = useCallback(
		(textbox: TextBox, enter: boolean) => {
			if (props.OnFocusLost) props.OnFocusLost(textbox, enter);

			const input = ApplyFilters(textbox.Text, filters);
			const value = decoder(input);

			textbox.Text = "";
			if (value !== undefined) {
				props.Apply(value);
			}
		},
		[props.OnFocusLost, props.Value, props.Apply, decoder],
	);
	const OnFocused = useCallback(
		(textbox: TextBox) => {
			if (props.MaintainValue) {
				const currentText = textbox.PlaceholderText;
				textbox.Text = currentText;
				textbox.CursorPosition = currentText.size() + 1;
			}
			if (props.OnFocused) props.OnFocused(textbox);
		},
		[props.OnFocused, props.MaintainValue],
	);

	const OnTextChanged = useCallback(
		(textbox: TextBox) => {
			if (props.OnTextChanged) props.OnTextChanged(textbox);

			const filtered = ApplyFilters(textbox.Text, filters);
			textbox.Text = filtered;
		},
		[props.OnTextChanged, props.Filters],
	);

	return (
		<InputBase
			OnTextChanged={OnTextChanged}
			HolderProps={props.HolderProps}
			Sprite={props.Sprite}
			OnFocusLost={OnFocusLost}
			OnFocused={OnFocused}
			CornerRadius={props.CornerRadius}
			TextboxProps={{
				TextTruncate: Enum.TextTruncate.AtEnd,
				...props.TextboxProps,
				PlaceholderText: parser(props.Value),
			}}
		>
			{props["children"]}
		</InputBase>
	);
}

export default InputEntry;
