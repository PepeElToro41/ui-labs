import React, { useCallback } from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import {
	DefaultOptionRenderer,
	OptionRendererFactory,
	OptionsRendersMap
} from "UI/Overlays/OptionList/Options/OptionRenders/OptionRendersMap";
import OptionListControl from ".";
import EnumListOverlay from "UI/Overlays/OptionList/Enum";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Text from "UI/Styles/Text";

function EnumListControl(props: ControlElementProps<AdvancedTypes.EnumList>) {
	const OnSetOption = useCallback(
		(keyIndex: string) => {
			const toSet = props.Control.List[keyIndex];
			if (toSet === undefined) return;
			if (toSet === props.Current) return;
			props.Apply(toSet);
		},
		[props.Control, props.Apply, props.Current]
	);
	const SetListOverlay = useCallback(
		(position: UDim2 | React.Binding<UDim2>, onClose: () => void) => {
			const element = (
				<EnumListOverlay
					Options={props.Control.List}
					Position={position}
					ChooseOption={OnSetOption}
					OnClose={onClose}
				/>
			);
			return { Key: "ChooseOverlay", Element: element };
		},
		[props.Current, props.Apply, props.Control]
	);

	const optionType = typeOf(props.Current);
	const OptionRenderer = (OptionsRendersMap[optionType] ?? DefaultOptionRenderer) as OptionRendererFactory;
	let currentIndex = "N/A";
	for (const [key, value] of pairs(props.Control.List)) {
		if (value === props.Current) {
			currentIndex = key;
			break;
		}
	}

	return (
		<OptionListControl ListOverlay={SetListOverlay}>
			<Div Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
				<LeftList Padding={new UDim(0, 5)} VerticalAlignment={Enum.VerticalAlignment.Center} />
				<Text
					Text={currentIndex}
					TextSize={12}
					LayoutOrder={-1}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
				<OptionRenderer Value={props.Current} ValueType={optionType} IsDescription={true} />
			</Div>
		</OptionListControl>
	);
}

export default EnumListControl;
