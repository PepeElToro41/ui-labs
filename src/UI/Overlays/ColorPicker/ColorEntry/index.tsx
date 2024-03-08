import React from "@rbxts/react";
import { Decoder, Parser, Widen } from "./Utils";
import { Div } from "UI/Styles/Div";
import Text from "UI/Styles/Text";
import InputEntry from "UI/Utils/InputEntry";

interface ColorEntryProps<T extends Color3 | number> {
	Title: string;
	Value: Widen<T>;
	Order?: number;

	Parser: Parser<T>;
	Decoder: Decoder<T>;
	Apply: (value: Widen<T>) => void;
}

function ColorEntry<T extends Color3 | number>(props: ColorEntryProps<T>) {
	return (
		<Div Size={new UDim2(1, 0, 0, 25)} LayoutOrder={props.Order}>
			<Text
				Position={UDim2.fromOffset(4, 0)}
				TextSize={12}
				Size={new UDim2(0, 100, 1, 0)}
				Text={props.Title}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<InputEntry
				Value={props.Value}
				Parser={props.Parser}
				Decoder={props.Decoder}
				Apply={props.Apply}
				MaintainValue={true}
				CornerRadius={6}
				TextboxProps={{ TextSize: 12, TextXAlignment: Enum.TextXAlignment.Center }}
				HolderProps={{
					Position: UDim2.fromOffset(40, 0),
					Size: new UDim2(1, -43, 1, 0),
				}}
			/>
		</Div>
	);
}

export default ColorEntry;
