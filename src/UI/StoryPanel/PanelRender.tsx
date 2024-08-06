import React from "@rbxts/react";
import { useToolsContext } from "Context/ToolsContext";
import StoryOverlay from "UI/StoryOverlay";
import PreviewControl from "UI/StoryPreview/PreviewControl";
import { Div } from "UI/Styles/Div";

interface PanelRenderProps {
	PreviewEntry: PreviewEntry | undefined;
}

function PanelRender(props: PanelRenderProps) {
	const toolsContext = useToolsContext();
	const entry = props.PreviewEntry;

	return (
		<Div key={"StoryPanel"} Size={new UDim2(1, 0, 1, -31)}>
			<PreviewControl />
			<StoryOverlay key={"StoryOverlay"} PreviewEntry={props.PreviewEntry} />
		</Div>
	);
}
export default PanelRender;
