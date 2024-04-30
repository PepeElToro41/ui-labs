import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useTween } from "Hooks/Utils/Tween";
import { useLifetimeAsync } from "UI/Holders/LifetimeChildren/LifetimeController";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface ToastInfoRenderProps {
	InfoText: string;
}

const ANCHOR_INFO = new TweenInfo(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

function ToastInfoRender(props: ToastInfoRenderProps) {
	const [anchor, tweenAnchor] = useTween(ANCHOR_INFO, 1);
	const theme = useTheme();

	useLifetimeAsync(props, () => Promise.try(() => tweenAnchor(1).Completed.Wait()));
	useMountEffect(() => {
		tweenAnchor(0);
	});

	return (
		<Div AnchorPoint={new Vector2(0.5, 0)} Position={new UDim2(0.5, 0, 0, 5)} Size={UDim2.fromOffset(0, 28)} ZIndex={3}>
			<frame
				key={"InfoHolder"}
				BackgroundTransparency={0.2}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={theme.StoryPreview.InfoToast}
				Size={UDim2.fromScale(0, 1)}
				AnchorPoint={anchor.map((a) => new Vector2(0, a))}
			>
				<Corner Radius={8} />
				<Padding PaddingX={12} />
				<Text AutomaticSize={Enum.AutomaticSize.X} Text={props.InfoText} Size={UDim2.fromScale(0, 1)} />
			</frame>
		</Div>
	);
}

export default ToastInfoRender;
