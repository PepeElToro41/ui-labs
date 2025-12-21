import React from "@rbxts/react";
import { ChooseOptionType } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import { DefaultOptionRenderer, OptionsRendersMap, OptionRendererFactory } from "./OptionRenders/OptionRendersMap";
import LeftList from "UI/Styles/List/LeftList";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";
import { Detector } from "UI/Styles/Detector";

interface ChooseOptionProps {
	Option: ChooseOptionType;
	Order: number;
	OnOptionClicked: () => void;
}

function setProps(props: ChooseOptionProps) {
	return props;
}

function ChooseOption(setprops: ChooseOptionProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	const [hovered, hoverApi] = useToggler(false);

	const optionType = typeOf(props.Option);
	const OptionRenderer = (OptionsRendersMap[optionType] ?? DefaultOptionRenderer) as OptionRendererFactory;

	return (
		<Detector
			Size={new UDim2(1, 0, 0, 26)}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={theme.List.FrameHovered}
			BackgroundTransparency={hovered ? 0 : 1}
			Event={{
				MouseEnter: hoverApi.enable,
				MouseLeave: hoverApi.disable,
				MouseButton1Click: props.OnOptionClicked
			}}
		>
			<Corner Radius={6} />
			<Div key={"OptionRender"} Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
				<Padding Left={10} Right={31} />
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} />
				<OptionRenderer Value={props.Option} ValueType={optionType} IsDescription={false} />
			</Div>
		</Detector>
	);
}

export default ChooseOption;
