import React, { useCallback, useEffect, useState } from "@rbxts/react";

import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown.js";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import RenderToolButtons from "./Buttons.tsx";

import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useCanvasHeight } from "Context/StoryPanelContext.js";
import { useMouseOffset } from "Hooks/Context/UserInput.js";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";

import { lerp } from "@rbxts/pretty-react-hooks";
import { selectPopup } from "Reflex/Overlay.js";

interface LeftToolbarProps {
	PreviewEntry: PreviewEntry;
}

const HOVER_INFO = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function LeftToolbar(props: LeftToolbarProps) {
	const { setPopup } = useProducer<RootProducer>();

	const [buttonContentHeight, setButtonContentHeight] = useState(0);
	const [hoverAlpha, tweenHoverAlpha] = useTween(HOVER_INFO, 0);
	const [hovered, hoverApi] = useToggler(false);
	const [canvasHeight] = useCanvasHeight();

	const overlay = useSelector(selectPopup);
	const mouseOffset = useMouseOffset();

	const isBlocked = overlay && overlay.Identifier === "ButtonDropdown";
	const isShowing = isBlocked || hovered;

	useEffect(() => {
		tweenHoverAlpha(isShowing ? 1 : 0);
	}, [isShowing]);

	const OnToolbarLeftClick = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup("BackButtonDropdown", <ToolbarDropdown Position={offset} />, "ButtonDropdown");
	}, []);

	return (
		<Div
			key={"IconToolbar"}
			Size={UDim2.fromOffset(37, buttonContentHeight)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromOffset(5, 5)}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<uisizeconstraint key={"MaxSize"} MaxSize={new Vector2(math.huge, canvasHeight)} />

			<Detector
				Size={UDim2.fromScale(1, 1)}
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton2Click: OnToolbarLeftClick
				}}
			/>

			<RenderToolButtons
				PreviewEntry={props.PreviewEntry}
				HoverAlpha={hoverAlpha.map((a) => UDim2.fromScale(-1 + a, 0))}
				onContentHeightChanged={setButtonContentHeight}
			/>

			<frame
				key={"Filler"}
				Size={new UDim2(0, 3, 1, -5)}
				Position={UDim2.fromOffset(0, 4)}
				BackgroundColor3={new Color3(0.45, 0.45, 0.45)}
				BackgroundTransparency={hoverAlpha.map((a) => lerp(0.9, 1, a))}
				ZIndex={2}
			>
				<Rounder />
			</frame>
		</Div>
	);
}

export default LeftToolbar;
