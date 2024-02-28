import Roact, { useCallback } from "@rbxts/roact";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import { HSV } from ".";
import SlideDrag from "UI/Utils/Draggers/SlideDrag";

interface ValuePickerProps {
	HSV: Roact.Binding<HSV>;
	Order?: number;
	SetHSV: (values: Partial<HSV>) => void;
}

const GRADIENT_SEQUENCE = new NumberSequence([new NumberSequenceKeypoint(0, 1), new NumberSequenceKeypoint(1, 0)]);

function ValuePicker(props: ValuePickerProps) {
	const OnApplyHSV = useCallback((pos: Vector2) => props.SetHSV({ S: 1 - pos.X, V: 1 - pos.Y }), [props.SetHSV]);

	return (
		<frame
			Key={"ValuePicker"}
			BackgroundColor3={props.HSV.map((v) => Color3.fromHSV(v.H, 1, 1))}
			LayoutOrder={props.Order ?? 0}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 100)}
		>
			<Corner Radius={6} />
			<Div
				Key={"Handle"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={props.HSV.map((v) => UDim2.fromScale(1 - v.S, 1 - v.V))}
				Size={UDim2.fromOffset(6, 6)}
				ZIndex={3}
			>
				<Rounder />
				<uistroke Color={Color3.fromRGB(255, 255, 255)} Key={"2"} />
			</Div>
			<frame Key={"BlackGrad"} BackgroundColor3={Color3.fromRGB(0, 0, 0)} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)} ZIndex={2}>
				<Corner Radius={3} />
				<uigradient Rotation={90} Transparency={GRADIENT_SEQUENCE} />
			</frame>
			<frame Key={"WhiteGrad"} BackgroundColor3={Color3.fromRGB(255, 255, 255)} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)}>
				<Corner Radius={4} />
				<uigradient Transparency={GRADIENT_SEQUENCE} />
			</frame>
			<SlideDrag
				DetectProps={{
					Size: UDim2.fromScale(1, 1),
				}}
				SlideDir="XY"
				PercentApply={OnApplyHSV}
			></SlideDrag>
		</frame>
	);
}

export default ValuePicker;
