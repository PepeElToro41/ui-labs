import { lerp } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import RenderToolButtons from "./Buttons.tsx";

interface RightToolbarProps {
	PreviewEntry: PreviewEntry;
}

const HOVER_INFO = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function RightToolbar(props: RightToolbarProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(HOVER_INFO, 0);

	useEffect(() => {
		tweenHoverAlpha(hovered ? 1 : 0);
	}, [hovered]);

	return (
		<Div
			key={"IconToolbar"}
			Size={UDim2.fromOffset(35, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={new UDim2(1, -5, 0, 5)}
			AnchorPoint={new Vector2(1, 0)}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<Detector
				Size={new UDim2(0, 35, 1, 0)}
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
				}}
			/>
			<RenderToolButtons PreviewEntry={props.PreviewEntry} HoverAlpha={hoverAlpha.map((a) => UDim2.fromScale(1 - a, 0))} />
			<frame
				key={""}
				Size={new UDim2(0, 3, 1, -8)}
				Position={new UDim2(1, 0, 0, 4)}
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={hoverAlpha.map((a) => lerp(0.9, 1, a))}
				ZIndex={2}
			>
				<Rounder />
			</frame>
		</Div>
	);
}

export default RightToolbar;
