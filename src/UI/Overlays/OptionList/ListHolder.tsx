import React, { PropsWithChildren, useBinding, useCallback } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";

interface ListHolderProps extends PropsWithChildren {
	OnAbsoluteSizeChanged?: (frame: Frame) => void;
}

const MAX_SCROLL_HEIGHT = 250;

function ListHolder(props: ListHolderProps) {
	const theme = useTheme();
	const [canvasSize, setCanvasSize] = useBinding(0);

	const OnAbsoluteCanvasSizeChanged = useCallback((scroller: ScrollingFrame) => {
		setCanvasSize(scroller.AbsoluteCanvasSize.Y);
	}, []);

	return (
		<frame
			key="Holder"
			LayoutOrder={1}
			BackgroundColor3={theme.List.Frame}
			BorderSizePixel={0}
			Size={canvasSize.map((s) => UDim2.fromOffset(0, math.min(s, MAX_SCROLL_HEIGHT)))}
			AutomaticSize={Enum.AutomaticSize.X}
			ZIndex={2}
			Change={{
				AbsoluteSize: props.OnAbsoluteSizeChanged,
			}}
		>
			<Corner Radius={6} />
			<Detector key="InputBlocker" Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X}>
				<scrollingframe
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ScrollBarThickness={3}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
					AutomaticCanvasSize={Enum.AutomaticSize.Y}
					CanvasSize={UDim2.fromScale(0, 0)}
					Change={{
						AbsoluteCanvasSize: OnAbsoluteCanvasSizeChanged,
					}}
				>
					<TopList Padding={new UDim(0, 1)} />
					{props.children}
				</scrollingframe>
			</Detector>
		</frame>
	);
}

export default ListHolder;
