import React from "@rbxts/react";
import { useToolsContext } from "Context/ToolsContext";
import StoryOverlay from "UI/StoryOverlay";
import StoryTools from "UI/StoryPanel/StoryTools";
import PreviewControl from "UI/StoryPreview/PreviewControl";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import AnchoredToolbar from "./AnchoredToolbar";

interface PanelRenderProps {
	PreviewEntry: PreviewEntry | undefined;
}

function PanelRender(props: PanelRenderProps) {
	const toolsContext = useToolsContext();
	const entry = props.PreviewEntry;

	return (
		<Div key={"StoryPanel"}>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<LeftList />
			<Div LayoutOrder={2}>
				<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
				<PreviewControl />
				<StoryOverlay key={"StoryOverlay"} PreviewEntry={props.PreviewEntry} />
				{entry && !(entry.OnViewport || entry.OnWidget) ? <StoryTools PreviewEntry={entry} /> : undefined}
			</Div>
			{toolsContext.ToolbarPosition === "Anchored" && entry ? <AnchoredToolbar PreviewEntry={entry} /> : undefined}
		</Div>
	);
}
export default PanelRender;
