import React, { useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview/StoryMount";
import { Div } from "UI/Styles/Div";
import PreviewController from "./PreviewController";
import { useActionsData, useActionsHeight, useActionsPinned } from "Context/StoryPanelContext";

interface PreviewControlProps {}

function PreviewControl(props: PreviewControlProps) {
	const previews = useSelector(selectStoryPreviews);
	const [pinned, height] = useActionsData();

	const controllers = useMemo(() => {
		const children: React.Children = new Map();

		previews.forEach((entry) => {
			children.set(entry.UID, <PreviewController PreviewEntry={entry} />);
		});

		return children;
	}, [previews]);

	return (
		<Div key={"Stories"} Size={pinned ? height.map((h) => new UDim2(1, 0, 1, -h)) : UDim2.fromScale(1, 1)}>
			{controllers}
		</Div>
	);
}

export default PreviewControl;
