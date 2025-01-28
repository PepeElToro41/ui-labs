import React, { useMemo } from "@rbxts/react";

import { useSelector } from "@rbxts/react-reflex";
import { useActionsData, useCanvasHeight } from "Context/StoryPanelContext";
import { selectStoryPreviews } from "Reflex/StoryPreview";

import { selectStoryLock } from "Reflex/Interface";
import { Div } from "UI/Styles/Div";
import PreviewController from "./PreviewController";

interface PreviewControlProps {}

function PreviewControl(props: PreviewControlProps) {
	const previews = useSelector(selectStoryPreviews);
	const storyLockers = useSelector(selectStoryLock);

	const [pinned, height] = useActionsData();
	const [, setCanvasHeight] = useCanvasHeight();

	const controllers = useMemo(() => {
		const children: ReactChildren = new Map();

		previews.forEach((entry) => {
			children.set(entry.UID, <PreviewController PreviewEntry={entry} />);
		});

		return children;
	}, [previews]);

	return (
		<Div
			key={"Stories"}
			Interactable={storyLockers.isEmpty()}
			Size={
				pinned
					? height.map((h) => new UDim2(1, 0, 1, -h))
					: UDim2.fromScale(1, 1)
			}
			LayoutOrder={2}
			Change={{
				AbsoluteSize: (rbx) => setCanvasHeight(rbx.AbsoluteSize.Y - 10)
			}}
		>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			{controllers}
		</Div>
	);
}

export default PreviewControl;
