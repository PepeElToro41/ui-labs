import Roact from "@rbxts/roact";
import { useBinding, useCallback, useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { MouseIconContext } from "UI/Contexts/Mouse/MouseIconContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import DeltaDrag from "UI/UIUtils/Draggers/DeltaDrag";
import { Sprite } from "UI/UIUtils/Sprite";
import { Div } from "UI/UIUtils/Styles/Div";

interface NumberControlProps extends Control.ControlType<number> {
	Step?: number;
	Clamp?: NumberRange;
	Dragger?: boolean;
	Sensibility?: number;
}

function setProps(props: NumberControlProps) {
	return props;
}

function StepAmount(amount: number, step?: number, start?: number) {
	if (!step) return amount;
	start = start ?? 0;
	const delta = amount - start;
	const steppedDelta = math.round(delta / step) * step;
	return start + steppedDelta;
}

function NumberControlCreate(props: NumberControlProps) {
	const theme = useContext(ThemeContext).Theme;
	const [inside, setInside] = useBinding(false);
	const mouseIconContext = useContext(MouseIconContext);
	const sensibility = useMemo(() => {
		return (props.Sensibility ?? props.Default) * 0.005;
	}, [props.Default]);

	const [amount, _setAmount] = useState(props.Control.Bind.Current as number);
	const [returnAmount, setReturnAmount] = useState(props.Control.Bind.Current as number);

	const MapAmount = useCallback(
		(mapper: (oldNumber: number) => number) => {
			_setAmount((oldAmount) => {
				let value = mapper(oldAmount);
				if (props.Clamp) {
					value = math.clamp(value, props.Clamp.Min, props.Clamp.Max);
				}
				return value;
			});
		},
		[props.Clamp, props.Step],
	);
	const SetAmount = useCallback(
		(value: number) => {
			MapAmount(() => value);
		},
		[MapAmount],
	);
	const SetDelta = useCallback(
		(delta: number) => {
			MapAmount((oldAmount) => oldAmount + delta * sensibility);
		},
		[sensibility],
	);
	useEffect(() => {
		setReturnAmount(StepAmount(amount, props.Step, props.Clamp?.Min));
	}, [amount]);
	useEffect(() => {
		props.ControlApply(returnAmount);
	}, [returnAmount]);

	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<frame
				Key="Entry"
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={theme.SearchInput}
				BorderSizePixel={0}
				Size={new UDim2(0, 65, 0, 22)}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uipadding PaddingLeft={new UDim(0, 8)} PaddingRight={new UDim(0, 8)}></uipadding>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<textbox
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					PlaceholderColor3={theme.SearchPlaceholder}
					PlaceholderText={tostring(math.floor(returnAmount * 100) / 100)}
					Size={new UDim2(0, 0, 1, 0)}
					Text={""}
					TextColor3={theme.TextColor}
					TextSize={12}
					ClipsDescendants={true}
					Event={{
						FocusLost: (input) => {
							const number = tonumber(input.Text);
							if (number) {
								SetAmount(number);
							}
							input.Text = "";
						},
					}}
				>
					<uisizeconstraint MaxSize={new Vector2(160, math.huge)} />
				</textbox>
			</frame>
			{props.Dragger ? (
				<Div
					Key="Dragger"
					Size={UDim2.fromScale(0.75, 0.75)}
					LayoutOrder={1}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
				>
					<Sprite
						Key="DraggerImage"
						Size={UDim2.fromScale(1, 1)}
						ImageRectOffset={new Vector2(64, 320)}
						ImageColor3={inside.map((inside) => {
							return inside ? theme.IconsColor : theme.IconsDisableColor;
						})}
					></Sprite>
					<DeltaDrag
						Key="DraggerDetector"
						DetectProps={{
							ZIndex: 2,
						}}
						SlideDir={"X"}
						StateUpdated={(state) => {
							const { hovering, dragging } = state;
							if (hovering || dragging) {
								setInside(true);
							} else {
								setInside(false);
							}
							if (dragging) {
								mouseIconContext.SetMouseIcon("NumberDrag", "ResizeH");
							} else {
								mouseIconContext.UnsetMouseIcon("NumberDrag");
							}
						}}
						DeltaApply={SetDelta}
					></DeltaDrag>
				</Div>
			) : undefined}
		</>
	);
}
const NumberControl = withHooks(NumberControlCreate);

export = NumberControl;
