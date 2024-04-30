import React, { useMemo } from "@rbxts/react";
import ActionsPanel from "UI/StoryOverlay/ActionsPanel";
import { Div } from "UI/Styles/Div";
import IconToolbar from "./IconToolbar";
import Text from "UI/Styles/Text";
import CanvasControls from "./CanvasControls";
import ToastInfo from "./ToastInfo";
import OnWidgetInfo from "./OnWidgetInfo";
import OnViewportInfo from "./OnViewportInfo";

interface StoryOverlayProps {
	PreviewEntry: PreviewEntry | undefined;
}

function setProps(props: StoryOverlayProps) {
	return props as Required<StoryOverlayProps>;
}

//Story overlay represents the actions panel (controls/summary), the tools like "Reload", "Zoom", and the zooming/panning controls
function StoryOverlay(setprops: StoryOverlayProps) {
	const props = setProps(setprops);
	const entry = props.PreviewEntry;

	const actionTabs = useMemo(() => {
		const tabs = new Map<string, ActionTabEntry>();
		if (entry) {
			entry.ActionComponents.forEach((v, i) => tabs.set(i, v));
		}
		return tabs;
	}, [entry]);

	return entry ? (
		<Div>
			<ActionsPanel key={"ActionsPanel"} Active={entry !== undefined} Tabs={actionTabs} RenderKey={entry?.Key} />
			<ToastInfo key={entry.UID} PreviewEntry={entry} />
			<IconToolbar PreviewEntry={entry} />
			{!entry.Visible ? undefined : entry.OnWidget ? (
				<OnWidgetInfo />
			) : entry.OnViewport ? (
				<OnViewportInfo />
			) : (
				<CanvasControls PreviewEntry={entry} />
			)}
		</Div>
	) : (
		<Div>
			<ActionsPanel key={"ActionsPanel"} Active={false} Tabs={new Map()} />
			<frame BackgroundColor3={new Color3(0, 0, 0)} BackgroundTransparency={0.6} Size={UDim2.fromScale(1, 1)}>
				<Text Text={"Select A Story"} TextSize={20} AnchorPoint={new Vector2(0.5, 0.5)} Position={UDim2.fromScale(0.5, 0.5)} />
			</frame>
		</Div>
	);
}

export default StoryOverlay;
