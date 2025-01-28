import React, { PropsWithChildren, useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { useToggler } from "Hooks/Utils/Toggler";
import ControlDropdown from "UI/Overlays/Dropdown/ControlDropdown";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface ControlHolderProps extends PropsWithChildren {
	ControlName: string;
	ControlReset: () => void;
	Order?: number;
}

function setProps(props: ControlHolderProps) {
	return props as Required<ControlHolderProps>;
}

function ControlHolder(setprops: ControlHolderProps) {
	const props = setProps(setprops);
	const [hovered, hoverApi] = useToggler(false);
	const { setPopup } = useProducer<RootProducer>();
	const mouseOffset = useMouseOffset();

	const OnDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup(
			"ControlDropdown",
			<ControlDropdown ControlReset={props.ControlReset} Position={offset} />
		);
	}, [props.ControlReset]);

	return (
		<Div Size={new UDim2(1, 0, 0, 35)} LayoutOrder={props.Order ?? 1}>
			<frame
				BackgroundColor3={new Color3(0, 0, 0)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0.9}
				Visible={hovered}
			/>
			<Div key={"ControlContents"}>
				<Padding PaddingX={10} />
				<Text
					key={"ControlName"}
					Text={props.ControlName}
					TextXAlignment={Enum.TextXAlignment.Left}
					Size={new UDim2(0, 185, 1, 0)}
					TextSize={13}
					TextTruncate={Enum.TextTruncate.AtEnd}
				/>
				<Div
					key={"ControlRender"}
					Position={UDim2.fromOffset(195, 0)}
					Size={new UDim2(1, -195, 1, 0)}
					ZIndex={2}
				>
					{props["children"] ?? []}
				</Div>
				<Detector
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton2Click: OnDropdown
					}}
				/>
			</Div>
		</Div>
	);
}

export default ControlHolder;
