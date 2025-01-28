import React, { useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useActionsData, useCanvasHeight } from "Context/StoryPanelContext";
import { selectStoryLock } from "Reflex/Interface";
import { GetEntryByUID, selectStoryPreviews } from "Reflex/StoryPreview";
import { Div } from "UI/Styles/Div";
import EnvironmentScheduler from "./EnvironmentScheduler";

interface PreviewControllerProps {}

function PreviewController(props: PreviewControllerProps) {
	const previews = useSelector(selectStoryPreviews);
	const storyLockers = useSelector(selectStoryLock);
	const [pinned, height] = useActionsData();
	const [, setCanvasHeight] = useCanvasHeight();

	const schedulers = useMemo(() => {
		const schedulersMap: Map<string, string[]> = new Map();

		// finding environment roots
		previews.forEach((entry) => {
			if (entry.EnvironmentTarget === undefined) {
				schedulersMap.set(entry.UID, [entry.UID]);
			}
		});

		// finding shared environments
		previews.forEach((entry) => {
			let parent = entry;

			while (parent.EnvironmentTarget !== undefined) {
				const setParent = GetEntryByUID(previews, parent.EnvironmentTarget);
				if (setParent === undefined) break;
				parent = setParent;

				if (setParent === entry) break; // prevents infinite loop
			}
			if (parent === entry) return; // this entry is a root
			if (parent.EnvironmentTarget !== undefined) return;

			const schedulerList = schedulersMap.get(parent.UID);
			if (schedulerList === undefined) return;
			schedulerList.push(entry.UID);
		});

		// generating schedulers
		const children: ReactChildren = new Map();
		for (const [uid, scheduler] of schedulersMap) {
			children.set(
				uid,
				<EnvironmentScheduler RootEnvironment={uid} Environments={scheduler} />
			);
		}
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
			{schedulers}
		</Div>
	);
}

export default PreviewController;
