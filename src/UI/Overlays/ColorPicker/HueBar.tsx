import React, { useCallback } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import SlideDrag from "UI/Utils/Draggers/SlideDrag";

import type { HSV } from ".";

interface HueBarProps {
	HSV: React.Binding<HSV>;
	Order?: number;
	SetHSV: (values: Partial<HSV>) => void;
}

function HueBar(props: HueBarProps) {
	const OnApplyHue = useCallback((hue: number) => props.SetHSV({ H: hue }), [props.SetHSV]);
	const theme = useTheme();

	return (
		<Div key="HuePicker" Size={new UDim2(1, -5, 0, 10)} LayoutOrder={props.Order ?? 0}>
			<SlideDrag
				DetectProps={{
					Size: new UDim2(1, 0, 1, 5)
				}}
				SlideDir="X"
				PercentApply={OnApplyHue}
			></SlideDrag>
			<imagelabel
				key={"HueGradient"}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://14010941769"
				Position={new UDim2(0, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, 8)}
			>
				<Rounder />
			</imagelabel>
			<frame
				key="Handle"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={props.HSV.map((hsv) => UDim2.fromScale(hsv.H, 0.5))}
				Size={new UDim2(0, 8, 0, 8)}
			>
				<Rounder />
				<uistroke Color={theme.ColorPicker.Handle} Thickness={2} />
			</frame>
		</Div>
	);
}

export default HueBar;
