import React, { useCallback, useMemo } from "@rbxts/react";
import Overlay from "../Overlay";
import { ChooseOptionType } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import TopList from "UI/Styles/List/TopList";
import { useOverlayAction } from "../Utils";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useProducer } from "@rbxts/react-reflex";
import EnumOption from "./Options/EnumOption";
import { useOverlayWrap } from "Hooks/Utils/OutsideWrapper";
import { Div } from "UI/Styles/Div";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import ListHolder from "./ListHolder";

interface EnumListOverlayProps {
	Position: UDim2 | React.Binding<UDim2>;
	Options: Record<string, ChooseOptionType>;
	ChooseOption: (keyIndex: string) => void;
	OnClose?: () => void;
}

function EnumListOverlay(props: EnumListOverlayProps) {
	const { resetPopup } = useProducer<RootProducer>();
	const [wrapped, OnAbsoluteSizeChanged] = useOverlayWrap(props.Position, new Vector2(0, 0), "Y");
	const theme = useTheme();

	const OverlayClose = useCallback(() => {
		resetPopup();
	}, []);

	const OnOptionClicked = useOverlayAction(
		(index: string) => {
			const isOptionAvailable = props.Options[index] !== undefined;
			if (!isOptionAvailable) return;
			props.ChooseOption(index);
		},
		[props.ChooseOption, props.Options],
	);
	useUnmountEffect(() => {
		if (props.OnClose) props.OnClose();
	});

	const options = useMemo(() => {
		const optionElements: React.Element[] = [];

		for (const [key, option] of pairs(props.Options)) {
			const element = <EnumOption Option={option} OptionName={key} OnOptionClicked={() => OnOptionClicked(key)} />;
			optionElements.push(element);
		}
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
			<ListHolder OnAbsoluteSizeChanged={OnAbsoluteSizeChanged}>{options}</ListHolder>
		</Overlay>
	);
}

export default EnumListOverlay;
