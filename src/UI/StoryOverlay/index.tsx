import React from "@rbxts/react";
import { useActionsData } from "Context/StoryPanelContext";
import { useToolsContext } from "Context/ToolsContext";
import { Div } from "UI/Styles/Div";
import Text from "UI/Styles/Text";
import CanvasControls from "./CanvasControls";
import LeftToolbar from "./IconToolbar/LeftToolbar";
import OnViewportInfo from "./OnViewportInfo";
import OnWidgetInfo from "./OnWidgetInfo";
import ToastInfo from "./ToastInfo";

interface StoryOverlayProps {
	PreviewEntry: PreviewEntry | undefined;
}

//Story overlay represents the actions panel (controls/summary), the tools like "Reload", "Zoom", and the zooming/panning controls
function StoryOverlay(props: StoryOverlayProps) {
	const entry = props.PreviewEntry;
	const toolsContext = useToolsContext().ToolbarPosition;
	const [pinned, height] = useActionsData();

	return entry ? (
		<Div
			ZIndex={3}
			Size={
				pinned
					? height.map((h) => new UDim2(1, 0, 1, -h))
					: UDim2.fromScale(1, 1)
			}
		>
			<ToastInfo key={entry.UID} PreviewEntry={entry} />
			{toolsContext === "Floating" ? (
				<LeftToolbar PreviewEntry={entry} />
			) : undefined}
			{!entry.Visible ? undefined : entry.OnWidget ? (
				<OnWidgetInfo />
			) : entry.OnViewport ? (
				<OnViewportInfo PreviewEntry={entry} />
			) : (
				<CanvasControls PreviewEntry={entry} />
			)}
		</Div>
	) : (
		<Div
			Size={
				pinned
					? height.map((h) => new UDim2(1, 0, 1, -h))
					: UDim2.fromScale(1, 1)
			}
		>
			<frame
				BackgroundColor3={new Color3(0, 0, 0)}
				BackgroundTransparency={0.6}
				Size={UDim2.fromScale(1, 1)}
			>
				<Text
					Text={"Select A Story"}
					TextSize={20}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
				/>
			</frame>
		</Div>
	);
}

export default StoryOverlay;
