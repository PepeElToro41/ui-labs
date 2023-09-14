import Roact from "@rbxts/roact";
import { useContext, withHooks } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import { Div } from "UI/UIUtils/Styles/Div";
import { Text } from "UI/UIUtils/Styles/Text";

interface UnknownDivisorProps {
	LayoutOrder: number;
}

function setProps(props: UnknownDivisorProps) {
	return props;
}

function UnknownDivisorCreate(setprops: UnknownDivisorProps) {
	const props = setProps(setprops);
	const theme = useContext(ThemeContext).Theme;
	return (
		<Div
			Key="UnknownDivisor"
			BackgroundTransparency={1}
			ClipsDescendants={true}
			LayoutOrder={props.LayoutOrder}
			Size={new UDim2(1, -8, 0, 20)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<frame
				Key="Divisor1"
				BackgroundColor3={theme.Divisor}
				BackgroundTransparency={0.7}
				BorderSizePixel={0}
				Size={new UDim2(0.5, 0, 0, 1)}
			/>
			<Text
				Key="UnknownLabel"
				AnchorPoint={new Vector2(0.5, 0)}
				AutomaticSize={Enum.AutomaticSize.X}
				Position={new UDim2(0.5, 0, 0, 0)}
				Size={new UDim2(0, 0, 1, 0)}
				Text="Unknown"
				LayoutOrder={1}
				TextColor3={theme.TextColor}
				TextSize={12}
				TextTransparency={0.5}
			>
				<uipadding PaddingLeft={new UDim(0, 7)} PaddingRight={new UDim(0, 5)} />
			</Text>
			<frame
				Key="Divisor2"
				BackgroundColor3={theme.Divisor}
				BackgroundTransparency={0.7}
				BorderSizePixel={0}
				LayoutOrder={2}
				Size={new UDim2(0.5, 0, 0, 1)}
			/>
		</Div>
	);
}

const UnknownDivisor = withHooks(UnknownDivisorCreate);

export = UnknownDivisor;
