import React, { useCallback } from "@rbxts/react";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import SlideDrag from "UI/Utils/Draggers/SlideDrag";

interface AlphaBarProps {
	Order?: number;
	Color: Color3;
	Alpha: number;
	OnApply: (newAlpha: number) => void;
}

function setProps(props: AlphaBarProps) {
	return props;
}

function AlphaBar(setprops: AlphaBarProps) {
	const props = setProps(setprops);

	const OnApplyAlpha = useCallback((val: number) => props.OnApply(val), [props.OnApply]);

	return (
		<Div key="HuePicker" Size={new UDim2(1, -5, 0, 10)} LayoutOrder={props.Order ?? 0}>
			<SlideDrag
				DetectProps={{
					Size: new UDim2(1, 0, 1, 5),
				}}
				SlideDir="X"
				PercentApply={OnApplyAlpha}
			></SlideDrag>
			<imagelabel
				Position={new UDim2(0, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, 8)}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Image={"rbxassetid://14013491588"}
				ScaleType={Enum.ScaleType.Tile}
				TileSize={new UDim2(0, 10, 0, 10)}
				ZIndex={-1}
			>
				<Rounder />
			</imagelabel>
			<frame
				Size={new UDim2(1, 0, 0, 8)}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={new UDim2(0, 0, 0.5, 0)}
				BackgroundColor3={props.Color}
			>
				<Rounder />
				<uigradient Transparency={new NumberSequence([new NumberSequenceKeypoint(0, 1), new NumberSequenceKeypoint(1, 0)])} />
			</frame>
			<frame
				key="Handle"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(props.Alpha, 0.5)}
				Size={new UDim2(0, 8, 0, 8)}
				ZIndex={1}
			>
				<Rounder />
				<uistroke Color={new Color3(1, 1, 1)} Thickness={2} />
			</frame>
		</Div>
	);
}

export default AlphaBar;
