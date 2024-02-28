import Roact from "@rbxts/roact";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import InputEntry from "UI/Utils/InputEntry";
import { Decoders } from "UI/Utils/InputEntry/Decoders";
import { Filters } from "UI/Utils/InputEntry/Filters";

interface AxisEntryProps {
	Name: string;
	Value: number;
	Order?: number;
	SetValue: (newValue: number) => void;
}

function setProps(props: AxisEntryProps) {
	return props;
}

function AxisEntry(setprops: AxisEntryProps) {
	const props = setProps(setprops);
	return (
		<Div Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X} LayoutOrder={props.Order ?? 0}>
			<LeftList />
			<Padding Right={6} />
			<Text Text={props.Name + ":"} Size={new UDim2(0, 30, 1, 0)} LayoutOrder={2} />
			<InputEntry
				Value={props.Value}
				Apply={props.SetValue}
				Decoder={Decoders.NumberDecoder()}
				Filters={[Filters.NumberOnly]}
				TextboxProps={{
					TextSize: 12,
					Size: UDim2.fromScale(0, 1),
					AutomaticSize: Enum.AutomaticSize.X,
					TextXAlignment: Enum.TextXAlignment.Center,
				}}
				HolderProps={{
					LayoutOrder: 3,
					Size: UDim2.fromScale(0, 1),
					AutomaticSize: Enum.AutomaticSize.X,
				}}
			>
				<uisizeconstraint MaxSize={new Vector2(220, math.huge)} MinSize={new Vector2(30, 0)} />
			</InputEntry>
		</Div>
	);
}

export default AxisEntry;
