import { Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import { useTween } from "UI/Hooks/Utils/useTween";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

const handleInfo = new TweenInfo(0.2, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0);
const hoverInfo = new TweenInfo(0.1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);

interface NumberControlProps extends Control.ControlType<number> {}

function setProps(props: NumberControlProps) {
	return props;
}

function NumberControlCreate(setprops: NumberControlProps) {
	const props = identity<Required<NumberControlProps>>(setProps(setprops) as Required<NumberControlProps>);
	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
		</>
	);
}
const NumberControl = withHooks(NumberControlCreate);

export = NumberControl;
