import { Spring, useEventListener, useMotor, useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useContext, useEffect, useRef, useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import ThemeContext from "UI/Contexts/ThemeContext";
import { useTween } from "UI/Hooks/Utils/useTween";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

const handleInfo = new TweenInfo(0.2, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0);
const hoverInfo = new TweenInfo(0.1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);

interface BoolControlProps extends Control.ControlType<boolean> {}

function setProps(props: BoolControlProps) {
	return props;
}

function BoolControlCreate(setprops: BoolControlProps) {
	const props = identity<Required<BoolControlProps>>(setProps(setprops) as Required<BoolControlProps>);
	const [enabled, setEnabled] = useState(props.Control.Bind.Current as boolean);
	const theme = useContext(ThemeContext).Theme;
	const [hoverSize, setHoverSize] = useTween(hoverInfo, 40);
	const handleRef = useRef<Frame>();
	const ResetControl = () => {
		setEnabled(props.Default);
	};
	useEventListener(props.ResetSignal, () => {
		print("Resetting");
		ResetControl();
	});
	useUpdateEffect(() => {
		ResetControl();
	}, [props.Control]);

	useEffect(() => {
		props.ControlApply(enabled);
		const handle = handleRef.getValue();
		if (!handle) return;
		TweenService.Create(handle, handleInfo, {
			Position: UDim2.fromScale(enabled ? 1 : 0, 0),
			AnchorPoint: new Vector2(enabled ? 1 : 0, 0),
		}).Play();
	}, [enabled]);
	useEffect(() => {
		const handle = handleRef.getValue();
		if (!handle) return;
		handle.Position = UDim2.fromScale(enabled ? 1 : 0, 0);
		handle.AnchorPoint = new Vector2(enabled ? 1 : 0, 0);
	}, []);

	return (
		<>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<frame
				Key="BoolFrame"
				BackgroundColor3={enabled ? Color3.fromRGB(0, 175, 255) : theme.ControlTheme.Bool.OffBackground}
				BorderSizePixel={0}
				Size={hoverSize.map((size) => new UDim2(0, size, 0, 20))}
			>
				<Detector
					ZIndex={2}
					Event={{
						MouseEnter: () => {
							setHoverSize(45);
						},
						MouseLeave: () => {
							setHoverSize(40);
						},
						MouseButton1Click: () => {
							setEnabled(!enabled);
						},
					}}
				></Detector>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<Div>
					<frame
						Key="Handle"
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BorderSizePixel={0}
						Size={new UDim2(1, 0, 1, 0)}
						SizeConstraint={Enum.SizeConstraint.RelativeYY}
						Ref={handleRef}
					>
						<uicorner CornerRadius={new UDim(0.5, 0)} />
					</frame>
					<uipadding
						PaddingBottom={new UDim(0, 3)}
						PaddingLeft={new UDim(0, 3)}
						PaddingRight={new UDim(0, 3)}
						PaddingTop={new UDim(0, 3)}
					/>
				</Div>
			</frame>
			<Text
				Key="StateLabel"
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				Size={new UDim2(0, 100, 0, 20)}
				Text={enabled ? "On" : "Off"}
				TextColor3={theme.TextColor}
				TextSize={12}
				TextXAlignment={Enum.TextXAlignment.Left}
				LayoutOrder={2}
			/>
		</>
	);
}
const BoolControl = withHooks(BoolControlCreate);

export = BoolControl;
