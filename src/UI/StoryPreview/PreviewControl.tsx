import React, { useMemo } from "@rbxts/react";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { selectPreview, selectStoryPreviews } from "Reflex/StoryPreview/StoryMount";
import { Div } from "UI/Styles/Div";
import PreviewController from "./PreviewController";
import { useActionsData, useActionsHeight, useActionsPinned } from "Context/StoryPanelContext";
import LeftList from "UI/Styles/List/LeftList";
import { useToolsContext } from "Context/ToolsContext";
import AnchoredToolbar from "UI/StoryPanel/AnchoredToolbar";
import { selectStorySelected } from "Reflex/StorySelection";

interface PreviewControlProps {}

function PreviewControl(props: PreviewControlProps) {
	const toolsContext = useToolsContext();
	const previews = useSelector(selectStoryPreviews);
	const selectedEntry = useSelector(selectStorySelected);
	const previewEntry = useSelectorCreator(selectPreview, selectedEntry);
	const [pinned, height] = useActionsData();

	const controllers = useMemo(() => {
		const children: ReactChildren = new Map();

		previews.forEach((entry) => {
			children.set(entry.UID, <PreviewController PreviewEntry={entry} />);
		});

		return children;
	}, [previews]);

	return (
		<Div key={"Previews"}>
			<LeftList />
			<Div key={"Stories"} Size={pinned ? height.map((h) => new UDim2(1, 0, 1, -h)) : UDim2.fromScale(1, 1)} LayoutOrder={2}>
				<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
				{controllers}
			</Div>
			{toolsContext.ToolbarPosition === "Anchored" && previewEntry ? <AnchoredToolbar PreviewEntry={previewEntry} /> : undefined}
		</Div>
	);
}

export default PreviewControl;
