import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { Div } from "UI/UIUtils/Styles/Div";

const padding = 10;
interface Props extends PropsWithChildren {}

interface ListModuleProps {
	ModuleBind: ModuleScript;
	Index: number;
	Color?: Color3;
	TextColor?: Color3;
}

export const ListModule = (props: ListModuleProps) => {
	return (
		<textbutton
			Key={props.Index}
			Text={props.ModuleBind.GetFullName()}
			TextSize={16}
			FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
			AutomaticSize={Enum.AutomaticSize.X}
			Size={UDim2.fromOffset(100, 30)}
			TextColor3={props.TextColor ?? new Color3(1, 1, 1)}
			BackgroundColor3={props.Color ?? new Color3(0.25, 0.25, 0.25)}
			Event={{
				MouseButton1Click: () => {
					game.GetService("Selection").Set([props.ModuleBind]);
				},
			}}
		>
			<uicorner CornerRadius={new UDim(0, 6)}></uicorner>
			<uipadding PaddingLeft={new UDim(0, 12)} PaddingRight={new UDim(0, 12)}></uipadding>
		</textbutton>
	);
};

export const ListHolder = (props: Props) => {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromOffset(0, 400)}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={Color3.fromRGB(38, 38, 38)}
		>
			<uicorner CornerRadius={new UDim(0, 6)}></uicorner>
			<scrollingframe
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				ScrollBarThickness={3}
				BorderSizePixel={0}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(0, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.X}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
			>
				<uilistlayout Padding={new UDim(0, 5)}></uilistlayout>
				<uipadding
					PaddingLeft={new UDim(0, padding)}
					PaddingRight={new UDim(0, padding)}
					PaddingBottom={new UDim(0, padding)}
					PaddingTop={new UDim(0, padding)}
				></uipadding>
				{props[Children]}
			</scrollingframe>
		</frame>
	);
};
