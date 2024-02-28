import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useCallback } from "@rbxts/roact";
import { PrimitiveControl } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";

const HANDLE_INFO = new TweenInfo(0.15, Enum.EasingStyle.Circular, Enum.EasingDirection.Out);

function BooleanControl(props: ControlElementProps<PrimitiveControl<"Boolean">>) {
	const theme = useTheme();
	const [handleAlpha, tweenHandleAlpha] = useTween(HANDLE_INFO, props.Current ? 1 : 0);
	const switchColor = props.Current ? theme.Controls.Boolean.SwitchOn : theme.Controls.Boolean.SwitchOff;
	const backColor = props.Current ? theme.Controls.Boolean.SwitchBackOn : theme.Controls.Boolean.SwitchBackOff;

	useUpdateEffect(() => {
		tweenHandleAlpha(props.Current ? 1 : 0);
	}, [props.Current]);

	const OnSwitchToggle = useCallback(() => {
		props.Apply(!props.Current);
	}, [props.Current, props.Apply]);

	return (
		<Div>
			<LeftList Padding={new UDim(0, 10)} VerticalAlignment={Enum.VerticalAlignment.Center} />
			<frame Key={"Switch"} Size={UDim2.fromOffset(44, 22)} BackgroundColor3={backColor}>
				<Rounder />
				<Div>
					<Padding Padding={3} />
					<frame
						BackgroundColor3={switchColor}
						Size={UDim2.fromScale(1, 1)}
						Position={handleAlpha.map((a) => UDim2.fromScale(a, 0))}
						AnchorPoint={handleAlpha.map((a) => new Vector2(a, 0))}
						SizeConstraint={Enum.SizeConstraint.RelativeYY}
					>
						<Rounder />
					</frame>
				</Div>
				<Detector Event={{ MouseButton1Click: OnSwitchToggle }} />
			</frame>
			<Text
				Key={"StateLabel"}
				TextSize={12}
				Weight="Medium"
				TextColor3={theme.Text.Color}
				Size={UDim2.fromOffset(100, 20)}
				TextXAlignment={Enum.TextXAlignment.Left}
				Text={props.Current ? "On" : "Off"}
			/>
		</Div>
	);
}

export default BooleanControl;
