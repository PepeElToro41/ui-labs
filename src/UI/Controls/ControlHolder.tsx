import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useContext, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { __ControlBinder } from "@rbxts/ui-labs/out/ControlsUtil";
import { _UILabsInternal as UL, _UILabsControls as ULC } from "@rbxts/ui-labs/out/Internal";
import Signal from "@rbxts/ui-labs/out/Signal";
import ThemeContext from "UI/Contexts/ThemeContext";
import IconButton from "UI/UIUtils/IconButton";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

declare global {
	namespace Control {
		interface ControlType<T> {
			ControlApply: (value: T) => void;
			Default: T;
			Control: ULC.IsRuntimeControl;
			ResetSignal: Signal;
		}
	}
}

interface ControlHolderProps extends PropsWithChildren {
	ControlName: string;
	LayoutOrder: number;
	ResetSignal: Signal;
}

function setProps(props: ControlHolderProps) {
	return props;
}

function ControlHolderCreate(setprops: ControlHolderProps) {
	const props = identity<Required<ControlHolderProps>>(setProps(setprops) as Required<ControlHolderProps>);
	const theme = useContext(ThemeContext).Theme;
	return (
		<Div Key={"Control" + props.LayoutOrder} LayoutOrder={props.LayoutOrder} Size={new UDim2(1, 0, 0, 35)}>
			<Div Key="Contents">
				<uipadding PaddingLeft={new UDim(0, 20)} />
				<uilistlayout
					Padding={new UDim(0, 7)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<Div Key="Control" LayoutOrder={2} Size={new UDim2(1, -200, 1, 0)}>
					{props[Roact.Children] ? props[Roact.Children] : undefined}
				</Div>
				<IconButton
					LayoutOrder={1}
					Size={UDim2.fromOffset(27, 27)}
					ButtonName="ControlReset"
					Description="Reset Control"
					OnClick={() => props.ResetSignal.Fire()}
					Icon={{
						RectOffset: new Vector2(128, 128),
						Size: UDim2.fromOffset(21, 21),
					}}
				></IconButton>
				<Text
					Key="ControlName"
					BackgroundTransparency={1}
					Size={new UDim2(0, 158, 1, 0)}
					Text={props.ControlName}
					TextColor3={theme.TextColor}
					TextSize={14}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Div>
			<frame
				Key="Divisor"
				BackgroundColor3={theme.Divisor}
				BackgroundTransparency={0.85}
				BorderSizePixel={0}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 1)}
			/>
		</Div>
	);
}
const ControlHolder = withHooks(ControlHolderCreate);

export = ControlHolder;
