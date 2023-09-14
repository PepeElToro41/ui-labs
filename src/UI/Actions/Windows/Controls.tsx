import Roact from "@rbxts/roact";
import { useContext, useMemo, withHooks } from "@rbxts/roact-hooked";
import { _UILabsInternal as UL, _UILabsControls as ULC } from "@rbxts/ui-labs/out/Internal";
import ThemeContext from "UI/Contexts/ThemeContext";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";
import Signal from "Utils/Signal";

interface ControlsProps {
	Controls: ULC.RuntimeControls;
	Api: ActionsAPI;
}

function setProps(props: ControlsProps) {
	return props;
}

function ControlsCreate(setprops: ControlsProps) {
	const props = identity<Required<ControlsProps>>(setProps(setprops) as Required<ControlsProps>);
	const theme = useContext(ThemeContext).Theme;
	const controlList = useMemo(() => {
		const controlEl: Roact.Element[] = [];
		for (const [key, control] of pairs(props.Controls)) {
			const controlType = control.ControlType;
			const Creator = ControlMap[controlType];
			const extraProps = ("Props" in control && control.Props) || {};
			const resetter = new Signal();
			const newControl = Roact.createElement(Creator as Callback, {
				...extraProps,
				Default: control.Default,
				ResetSignal: resetter,
				Control: control,
				ControlApply: (newValue: unknown) => {
					control.Bind.Set(newValue);
				},
			});

			const controlHolder = (
				<ControlHolder ControlName={control.DisplayName ?? key} LayoutOrder={control.Order ?? 0} ResetSignal={resetter}>
					{newControl}
				</ControlHolder>
			);
			controlEl.push(controlHolder);
		}
		return controlEl;
	}, [props.Controls]);
	return (
		<Div Key="Controls" Size={new UDim2(1, 0, 1, 0)} ZIndex={2}>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<Div Key="Title" Size={new UDim2(1, 100, 0, 30)}>
				<Div Key="Contents">
					<uipadding PaddingLeft={new UDim(0, 20)} />
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					<Text
						Key="NameLabel"
						Size={new UDim2(0, 200, 1, 0)}
						Text="Name"
						TextColor3={theme.TextDisabledColor}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<Text
						Key="ControlLabel"
						Size={new UDim2(0, 200, 1, 0)}
						Text="Control"
						TextColor3={theme.TextDisabledColor}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</Div>
				<frame
					Key="Divisor1"
					BackgroundColor3={theme.Divisor}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Position={new UDim2(0, 0, 1, 0)}
					Size={new UDim2(1, 0, 0, 1)}
				/>
				<frame
					Key="Divisor2"
					BackgroundColor3={theme.Divisor}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, 1)}
				/>
			</Div>
			<scrollingframe
				Key="ControlList"
				Active={true}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(0, 0, 0, 0)}
				ScrollBarThickness={2}
				Size={new UDim2(1, 0, 1, -30)}
				ZIndex={2}
			>
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
				{controlList}
			</scrollingframe>
		</Div>
	);
}
const Controls = withHooks(ControlsCreate);

export = Controls;
