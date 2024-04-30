import React, { useCallback, useMemo } from "@rbxts/react";
import Overlay from "../Overlay";
import { useProducer } from "@rbxts/react-reflex";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { ChooseOptionType } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import ChooseOption from "./Options/ChooseOption";
import { useOverlayAction } from "../Utils";
import { useOverlayWrap } from "Hooks/Utils/OutsideWrapper";
import { Div } from "UI/Styles/Div";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";

interface ChooseListOverlayProps {
	Position: UDim2 | React.Binding<UDim2>;
	Options: ChooseOptionType[];
	ChooseOption: (optionIndex: number) => void;
	OnClose?: () => void;
}

function ChooseListOverlay(props: ChooseListOverlayProps) {
	const { resetOverlay } = useProducer<RootProducer>();
	const [wrapped, OnAbsoluteSizeChanged] = useOverlayWrap(props.Position, new Vector2(0, 0), "Y");
	const theme = useTheme();

	const OverlayClose = useCallback(() => {
		resetOverlay();
	}, [props.OnClose]);
	const OnOptionClicked = useOverlayAction(
		(index: number) => {
			props.ChooseOption(index);
			const isOptionAvailable = props.Options[index] !== undefined;
			if (!isOptionAvailable) return;
		},
		[props.ChooseOption, props.Options],
	);
	useUnmountEffect(() => {
		if (props.OnClose) props.OnClose();
	});

	const options = useMemo(() => {
		const optionElements: React.Element[] = [];

		props.Options.forEach((option, index) => {
			const element = <ChooseOption Option={option} Order={index} OnOptionClicked={() => OnOptionClicked(index)} />;
			optionElements.push(element);
		});
		return optionElements;
	}, [props.Options, props.ChooseOption]);

	return (
		<Overlay
			Size={UDim2.fromOffset(0, 0)}
			AnchorPoint={wrapped ? new Vector2(0, 1) : new Vector2(0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
			Position={props.Position}
			OnClickClose={OverlayClose}
		>
			<TopList Padding={new UDim(0, 1)} />
			<Div key={"Separator"} Size={new UDim2(1, 0, 0, wrapped ? 13 : 14)} LayoutOrder={wrapped ? 2 : 0} />
			<frame
				key="Holder"
				LayoutOrder={1}
				BackgroundColor3={theme.List.Frame}
				BorderSizePixel={0}
				Size={UDim2.fromScale(0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				ZIndex={2}
				Change={{
					AbsoluteSize: OnAbsoluteSizeChanged,
				}}
			>
				<Corner Radius={6} />
				<Detector key="InputBlocker">
					<TopList Padding={new UDim(0, 1)} />
					{options}
				</Detector>
			</frame>
		</Overlay>
	);
}

export default ChooseListOverlay;
