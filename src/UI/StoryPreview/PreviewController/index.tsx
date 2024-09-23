import React, { useEffect, useState } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useStoryRequire } from "UI/StoryPreview/PreviewController/StoryRequire";
import { MountStory } from "./Mount";
import { useInstance } from "Hooks/Utils/Instance";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import HolderParenter from "./Holders/HolderParenter";
import { CheckStory } from "./StoryCheck/StoryCheck";
import { Signal } from "@rbxts/lemon-signal";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { selectClearOutputOnReload } from "Reflex/Interface";
import { selectStorySelected } from "Reflex/StorySelection";
import { LogService } from "@rbxts/services";

interface PreviewControllerProps {
	PreviewEntry: PreviewEntry;
}

export interface RecoverControlEntry {
	RecoverType: "Control";
	Control: ObjectControl;
	Value: ControlValue;
}
export interface RecoverGroupEntry {
	RecoverType: "ControlGroup";
	Controls: Record<string, RecoverControlEntry>;
}

export type RecoverControlsData = Record<string, RecoverControlEntry | RecoverGroupEntry>;

function PreviewController(props: PreviewControllerProps) {
	const clearOutputOnReload = useSelector(selectClearOutputOnReload);
	const selectedPreview = useSelector(selectStorySelected);
	const [result, reloader] = useStoryRequire(props.PreviewEntry);
	const [renderer, setRenderer] = useState<{ Key: string; MountType: MountType; Renderer: React.Element }>();
	const [recoverControlsData, setRecoverControlsData] = useState<RecoverControlsData>();

	const entry = props.PreviewEntry;
	const key = props.PreviewEntry.Key;

	const { setMountData } = useProducer<RootProducer>();

	const mountFrame = useInstance("Frame", undefined, {
		Name: "StoryHolder",
		Size: UDim2.fromScale(1, 1),
		BackgroundTransparency: 1,
	});
	useEffect(() => {
		//Updating the reloader
		setMountData(key, { HotReloader: reloader });
	}, [reloader, key]);
	useEffect(() => {
		setMountData(key, { Holder: mountFrame });
	}, [mountFrame, key]);
	useEffect(() => {
		mountFrame.Visible = entry.Visible;
	}, [entry.Visible]);
	//AutoReload
	useEffect(() => {
		if (!reloader) return;
		reloader.AutoReload = entry.AutoReload;
	}, [reloader, entry.AutoReload]);

	useEffect(() => {
		//Mounting story
		if (result === undefined) return;
		const check = CheckStory(result);
		if (!check.Sucess) return warn("UI Labs: " + check.Error);
		mountFrame.Name = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);
		const unmountSignal = new Signal();

		if (clearOutputOnReload) {
			const isSelected = selectedPreview === props.PreviewEntry.UID || selectedPreview === props.PreviewEntry.Key;

			if (selectedPreview === undefined || isSelected) {
				LogService.ClearOutput();
			}
		}

		const gotRenderer = MountStory(
			check.Type,
			props.PreviewEntry,
			check.Result,
			mountFrame,
			unmountSignal,
			recoverControlsData,
			setRecoverControlsData,
		);
		setRenderer({ Key: tostring(newproxy()), MountType: check.Type, Renderer: gotRenderer });

		return () => {
			unmountSignal.Fire();
			unmountSignal.Destroy();

			mountFrame.ClearAllChildren();
		};
	}, [result]);

	const renderMap: ReactChildren = new Map();
	if (renderer) renderMap.set(renderer.Key, renderer.Renderer);

	const render = (
		<React.Fragment>
			<HolderParenter MountFrame={mountFrame} MountType={renderer?.MountType} Entry={entry} />
			{renderMap}
		</React.Fragment>
	);
	return render;
}

export default PreviewController;
