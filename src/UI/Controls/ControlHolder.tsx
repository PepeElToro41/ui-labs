import Roact, { PropsWithChildren } from "@rbxts/roact";
import { withHooksPure } from "@rbxts/roact-hooked";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

declare global {
	namespace Control {
		interface ControlType<T> {
			ControlApply: (value: T) => void;
			Default: T;
		}
	}
}

interface ControlHolderProps extends PropsWithChildren {
	ControlName: string;
	LayoutOrder: number;
}

function setProps(props: ControlHolderProps) {
	return props;
}

function ControlHolderCreate(setprops: ControlHolderProps) {
	const props = identity<Required<ControlHolderProps>>(setProps(setprops) as Required<ControlHolderProps>);

	return (
		<Div Key={"Control" + props.LayoutOrder} LayoutOrder={props.LayoutOrder} Size={new UDim2(1, 0, 0, 35)}>
			<Div Key="Contents">
				<uipadding PaddingLeft={new UDim(0, 20)} />
				<uilistlayout FillDirection={Enum.FillDirection.Horizontal} SortOrder={Enum.SortOrder.LayoutOrder} />
				<Div Key="Control" LayoutOrder={1} Size={new UDim2(1, -200, 1, 0)}>
					{props[Roact.Children] ? props[Roact.Children] : undefined}
				</Div>
				<Text
					Key="ControlName"
					BackgroundTransparency={1}
					Size={new UDim2(0, 200, 1, 0)}
					Text={props.ControlName}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={14}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Div>
			<frame
				Key="Divisor"
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={0.85}
				BorderSizePixel={0}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 1)}
			/>
		</Div>
	);
}
const ControlHolder = withHooksPure(ControlHolderCreate);

export = ControlHolder;
