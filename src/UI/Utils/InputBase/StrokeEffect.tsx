import Roact, { useEffect } from "@rbxts/roact";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";

interface StrokeEffectProps {
	Active: boolean;
	FrameSize: Roact.Binding<Vector2>;
	CornerRadius?: number;
}

const PHASE_INFO = new TweenInfo(0.2, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0);

function StrokeEffect(props: StrokeEffectProps) {
	const theme = useTheme();
	const [phase, tweenPhase] = useTween(PHASE_INFO, 0);

	useEffect(() => {
		tweenPhase(props.Active ? 1 : 0);
	}, [props.Active]);

	return (
		<Div
			Key="StrokeEffect"
			Size={phase.map((p) => new UDim2(p, 3, 1, 2))}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			ClipsDescendants={true}
			Visible={phase.map((p) => p > 0)}
		>
			<frame
				Key="StrokeFrame"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={props.FrameSize.map((size) => UDim2.fromOffset(size.X, size.Y))}
			>
				<Corner Radius={props.CornerRadius ?? 8} />
				<uistroke Color={theme.Divisor.Color} Transparency={0.6} />
			</frame>
		</Div>
	);
}

export default StrokeEffect;
