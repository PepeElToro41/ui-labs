import React, { PropsWithChildren, useCallback } from "@rbxts/react";
import FrameFill from "UI/Holders/FrameFill";
import Corner from "UI/Styles/Corner";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import DropShadow from "UI/Utils/DropShadow";
import Overlay from "../Overlay";
import { useProducer } from "@rbxts/react-reflex";
import { Detector } from "UI/Styles/Detector";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useOverlayWrapXY } from "Hooks/Utils/OutsideWrapper";

interface DropdownProps extends PropsWithChildren {
	Position: UDim2 | React.Binding<UDim2>;
	Width?: number;
}

function Dropdown(props: DropdownProps) {
	const theme = useTheme();
	const [wrappedX, wrappedY, OnAbsoluteSizeChanged] = useOverlayWrapXY(props.Position, new Vector2(0, 0));
	const { resetPopup } = useProducer<RootProducer>();

	const OnClose = useCallback(() => {
		resetPopup();
	}, []);

	return (
		<Overlay
			Size={UDim2.fromOffset(props.Width ?? 220, 0)}
			AnchorPoint={new Vector2(wrappedX ? 1 : 0, wrappedY ? 1 : 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={props.Position}
			OnClickClose={OnClose}
		>
			<frame
				key="Holder"
				BackgroundColor3={theme.Dropdown.Color}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				ZIndex={2}
				Change={{
					AbsoluteSize: OnAbsoluteSizeChanged,
				}}
			>
				<Corner Radius={4} />
				<Detector key="InputBlocker">
					<Padding Padding={5} />
					<TopList Padding={new UDim(0, 1)} />
					{props["children"] ?? []}
				</Detector>
			</frame>
			<FrameFill key={"ShadowHolder"} FillDir="Y" Size={UDim2.fromScale(1, 0)} FrameProps={{ BackgroundTransparency: 1 }}>
				<DropShadow />
			</FrameFill>
		</Overlay>
	);
}

export default Dropdown;
