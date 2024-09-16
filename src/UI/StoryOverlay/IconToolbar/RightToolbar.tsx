import { lerp } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect } from "@rbxts/react";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Rounder from "UI/Styles/Rounder";
import RenderToolButtons from "./Buttons.tsx";
import { useSelector, useProducer } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput.js";
import { selectPopup } from "Reflex/Overlay.js";
import ToolbarDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarDropdown.js";

interface RightToolbarProps {
	PreviewEntry: PreviewEntry;
}

const HOVER_INFO = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function RightToolbar(props: RightToolbarProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(HOVER_INFO, 0);
	const overlay = useSelector(selectPopup);
	const { setPopup } = useProducer<RootProducer>();
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
			Size={UDim2.fromOffset(37, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={new UDim2(1, -5, 0, 5)}
			AnchorPoint={new Vector2(1, 0)}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<Detector
				Size={UDim2.fromScale(1, 1)}
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton2Click: OnToolbarLeftClick,
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
