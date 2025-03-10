import React, { useMemo, useState } from "@rbxts/react";

import StoryOverlay from "UI/StoryOverlay";
import StoryTools from "UI/StoryPanel/StoryTools";
import PreviewControl from "UI/StoryPreview/PreviewControl";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import ActionsPanel from "./ActionsPanel";
import AnchoredToolbar from "./AnchoredToolbar";

import { useToolsContext } from "Context/ToolsContext";

interface PanelRenderProps {
	PreviewEntry: PreviewEntry | undefined;
}

function PanelRender(props: PanelRenderProps) {
	const toolsContext = useToolsContext();
	const entry = props.PreviewEntry;

	const [actionsPanelHeight, setActionsPanelHeight] = useState(0);

	const actionTabs = useMemo(() => {
		const tabs = new Map<string, ActionTabEntry>();
		if (entry) {
			entry.ActionComponents.forEach((v, i) => tabs.set(i, v));
		}

		return tabs;
	}, [entry]);

	return (
		<Div key={"StoryPanel"} LayoutOrder={2}>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<Div key={"StoryContents"} LayoutOrder={1}>
				<LeftList />
				<Div LayoutOrder={2}>
					<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
					<PreviewControl />
					<StoryOverlay
						key={"StoryOverlay"}
						PreviewEntry={props.PreviewEntry}
					/>
					{entry && !(entry.OnViewport || entry.OnWidget) ? (
						<StoryTools PreviewEntry={entry} />
					) : undefined}
				</Div>
				{toolsContext.ToolbarPosition === "Anchored" && entry ? (
					<AnchoredToolbar PreviewEntry={entry} />
				) : undefined}
			</Div>
			<Div
				key={"ActionsPanelContainer"}
				Change={{
					AbsoluteSize: (rbx) => {
						setActionsPanelHeight(rbx.AbsoluteSize.Y);
					}
				}}
			>
				{entry !== undefined ? (
					<ActionsPanel
						key={"ActionsPanel"}
						Active={true}
						Tabs={actionTabs}
						RenderKey={entry?.UID}
						MaxHeight={actionsPanelHeight}
					/>
				) : (
					<ActionsPanel key={"ActionsPanel"} Active={false} Tabs={new Map()} />
				)}
			</Div>
		</Div>
	);
}
export default PanelRender;
