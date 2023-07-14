import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import { SetControls } from "Declarations/StoryPreview";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

interface ControlsProps {
	Controls: SetControls;
}

function setProps(props: ControlsProps) {
	return props;
}

function ControlsCreate(setprops: ControlsProps) {
	const props = identity<Required<ControlsProps>>(setProps(setprops) as Required<ControlsProps>);
	const controlList = useMemo(() => {
		const controlEl: Roact.Element[] = [];
		let order = 0;
		for (const [key, control] of pairs(props.Controls)) {
			const applier = (value: unknown) => {
				print("IT CHANGED LOL", value);
			};
			const controlType = control.ControlType;
			const Creator = ControlMap[controlType];
			const extraProps = ("Props" in control && control.Props) || {};
			const newControl = Roact.createElement(Creator as never, {
				Default: control.Default,
				ControlApply: applier,
				...extraProps,
			});
			const controlHolder = (
				<ControlHolder ControlName={key} LayoutOrder={order}>
					{newControl}
				</ControlHolder>
			);
			controlEl.push(controlHolder);
			order++;
		}
		return controlEl;
	}, [props.Controls]);
	return (
		<Div Key="Controls" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} ZIndex={2}>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<frame Key="Title" BackgroundTransparency={1} Size={new UDim2(1, 100, 0, 30)}>
				<frame Key="Contents" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
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
						TextColor3={Color3.fromRGB(176, 176, 176)}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<Text
						Key="ControlLabel"
						Size={new UDim2(0, 200, 1, 0)}
						Text="Control"
						TextColor3={Color3.fromRGB(176, 176, 176)}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
				<frame
					Key="Divisor1"
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Position={new UDim2(0, 0, 1, 0)}
					Size={new UDim2(1, 0, 0, 1)}
				/>
				<frame
					Key="Divisor2"
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0.85}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, 1)}
				/>
			</frame>
			<scrollingframe
				Key="ControlList"
				Active={true}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(0, 0, 0, 0)}
				ClipsDescendants={false}
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
