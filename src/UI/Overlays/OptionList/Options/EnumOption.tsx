import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import { OptionsRendersMap, DefaultOptionRenderer, OptionRendererFactory } from "./OptionRenders/OptionRendersMap";
import { ChooseOptionType } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import Text from "UI/Styles/Text";

interface EnumOptionProps {
	Option: ChooseOptionType;
	OptionName: string;
	OnOptionClicked: () => void;
}

function setProps(props: EnumOptionProps) {
	return props;
}

function EnumOption(setprops: EnumOptionProps) {
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
				MouseButton1Click: props.OnOptionClicked,
			}}
		>
			<Corner Radius={6} />
			<Div key={"OptionRender"}>
				<Padding Left={10} Right={8} />
				<LeftList Padding={new UDim(0, 28)} VerticalAlignment={Enum.VerticalAlignment.Center} />
				<Text
					Text={props.OptionName}
					TextSize={12}
					LayoutOrder={-1}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
				<OptionRenderer Value={props.Option} ValueType={optionType} IsDescription={true} />
			</Div>
		</Detector>
	);
}

export default EnumOption;
