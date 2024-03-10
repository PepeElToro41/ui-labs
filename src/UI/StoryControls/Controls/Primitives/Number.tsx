import { useBindingListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { PrimitiveControl } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import DeltaDrag from "UI/Utils/Draggers/DeltaDrag";
import DropShadow from "UI/Utils/DropShadow";
import InputEntry from "UI/Utils/InputEntry";
import { Decoders } from "UI/Utils/InputEntry/Decoders";
import { Filters } from "UI/Utils/InputEntry/Filters";
import { Parsers } from "UI/Utils/InputEntry/Parsers";
import Sprite from "UI/Utils/Sprite";

function StepAmount(amount: number, step?: number, start?: number) {
	if (step === undefined) return amount;
	start = start ?? 0;
	const delta = amount - start;
	const steppedDelta = math.round(delta / step) * step;
	return start + steppedDelta;
}

function NumberControl(props: ControlElementProps<PrimitiveControl<"Number">>) {
	const [dragActive, setDragActive] = useState(false);
	//This is needed as an proxy for decimal numbers that can get rounded because of stepped (used for the dragger)
	const [proxyCurrent, setProxyCurrent] = useBinding<number>(props.Current);
	const theme = useTheme();

	const sensibility = props.Control.Sensibility * 0.03;
	const control = props.Control;
	const min = control.Min ?? -math.huge;
	const max = control.Max ?? math.huge;

	const OnDragStateUpdated = useCallback((state: { hovering: boolean; dragging: boolean }) => {
		setDragActive(state.hovering || state.dragging);
	}, []);

	const ApplyAmount = useCallback(
		(amount: number) => {
			const clamped = math.clamp(amount, min, max);
			const stepped = StepAmount(clamped, props.Control.Step, control.Min ?? 0);
			if (stepped === props.Current) return;

			props.Apply(stepped);
		},
		[props.Control, props.Current, props.Apply],
	);
	const SetDelta = useCallback(
		(delta: number) => {
			const proxy = proxyCurrent.getValue();
			setProxyCurrent(proxy + delta * sensibility * 0.04);
		},
		[ApplyAmount, props.Current],
	);
	useEffect(() => {
		setProxyCurrent(props.Current);
	}, [props.Current]);
	useBindingListener(proxyCurrent, (proxy) => {
		ApplyAmount(proxy);
	});

	return (
		<Div>
			<Padding PaddingY={4} />
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 10)} />
			<InputEntry
				Value={props.Current}
				Apply={ApplyAmount}
				Parser={Parsers.NumberParser(3)}
				Decoder={Decoders.NumberDecoder()}
				Filters={[Filters.NumberOnly]}
				TextboxProps={{
					TextSize: 12,
					Size: UDim2.fromScale(0, 1),
					AutomaticSize: Enum.AutomaticSize.X,
					TextXAlignment: Enum.TextXAlignment.Center,
				}}
				HolderProps={{
					LayoutOrder: 1,
					Size: UDim2.fromScale(0, 1),
					AutomaticSize: Enum.AutomaticSize.X,
				}}
			>
				<uisizeconstraint MaxSize={new Vector2(220, math.huge)} MinSize={new Vector2(30, 0)} />
			</InputEntry>
			{control.Dragger && (
				<Div key="Dragger" Size={UDim2.fromOffset(25, 25)} LayoutOrder={1} SizeConstraint={Enum.SizeConstraint.RelativeYY}>
					<Sprite
						key="DraggerImage"
						ImageProps={{
							Size: UDim2.fromScale(1, 1),
							ImageColor3: dragActive ? theme.Icon.Color : theme.Icon.Disabled,
						}}
						Sprite="Dragger"
					></Sprite>
					<DeltaDrag
						key="DraggerDetector"
						DetectProps={{
							ZIndex: 2,
						}}
						SlideDir={"X"}
						StateUpdated={OnDragStateUpdated}
						DeltaApply={SetDelta}
					></DeltaDrag>
				</Div>
			)}
		</Div>
	);
}

export default NumberControl;
