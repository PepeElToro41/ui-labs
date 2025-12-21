import React, { useCallback } from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import ChooseListOverlay from "UI/Overlays/OptionList/Choose";
import {
	DefaultOptionRenderer,
	OptionsRendersMap,
	OptionRendererFactory
} from "UI/Overlays/OptionList/Options/OptionRenders/OptionRendersMap";
import OptionListControl from ".";

function ChooseControl(props: ControlElementProps<AdvancedTypes.Choose>) {
	const OnSetOption = useCallback(
		(optionIndex: number) => {
			const toSet = props.Control.List[optionIndex];
			if (toSet === undefined) return;
			if (toSet === props.Current) return;
			props.Apply(toSet);
		},
		[props.Control, props.Apply, props.Current]
	);
	const SetListOverlay = useCallback(
		(position: UDim2 | React.Binding<UDim2>, onClose: () => void) => {
			const element = (
				<ChooseListOverlay
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

	return (
		<OptionListControl ListOverlay={SetListOverlay}>
			<OptionRenderer Value={props.Current} ValueType={optionType} IsDescription={false} />
		</OptionListControl>
	);
}

export default ChooseControl;
