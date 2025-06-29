import { Signal } from "@rbxts/lemon-signal";
import React, { useEffect, useState } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { HttpService, LogService } from "@rbxts/services";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import { useInstance } from "Hooks/Utils/Instance";
import Configs from "Plugin/Configs";
import { WARNINGS } from "Plugin/Warnings";
import {
	selectClearOutputOnReload,
	selectStudioMode
} from "Reflex/PluginSettings";
import { selectStorySelected } from "Reflex/StorySelection";
import { useStoryRequire } from "UI/StoryPreview/PreviewController/StoryRequire";
import { UILabsWarn } from "Utils/MiscUtils";
import HolderParenter from "./Holders/HolderParenter";
import { MountStory } from "./Mount";
import { CheckStory } from "./StoryCheck/StoryCheck";

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

export type RecoverControlsData = Record<
	string,
	RecoverControlEntry | RecoverGroupEntry
>;

interface MountInfo {
	Key: string;
	MountType: MountType;
	Result: MountResults[MountType];
}

const LISTENER_ZINDEX = 50;

function PreviewController(props: PreviewControllerProps) {
	const clearOutputOnReload = useSelector(selectClearOutputOnReload);
	const selectedPreview = useSelector(selectStorySelected);
	const studioMode = useSelector(selectStudioMode);

	const [canReload, setCanReload] = useState(false);
	const [result, reloader] = useStoryRequire(
		props.PreviewEntry,
		studioMode,
		canReload
	);
	const [renderer, setRenderer] = useState<{
		Key: string;
		MountType: MountType;
		Renderer: React.Element;
	}>();
	const [recoverControlsData, setRecoverControlsData] =
		useState<RecoverControlsData>();

	const entry = props.PreviewEntry;
	const key = props.PreviewEntry.Key;

	const { setMountData } = useProducer<RootProducer>();

	const mountFrame = useInstance("Frame", undefined, {
		Name: "StoryHolder",
		Size: UDim2.fromScale(1, 1),
		BackgroundTransparency: 1
	});
	const listenerFrame = useInstance("Frame", undefined, {
		Name: "UILabsInputListener",
		Size: UDim2.fromScale(1, 1),
		BackgroundTransparency: 1,
		ZIndex: LISTENER_ZINDEX
	});

	useEffect(() => {
		//Updating the reloader
		setMountData(key, { HotReloader: reloader });
	}, [reloader, key]);
	useEffect(() => {
		setMountData(key, { Holder: mountFrame, ListenerFrame: listenerFrame });
	}, [mountFrame, listenerFrame, key]);
	useEffect(() => {
		mountFrame.Visible = entry.Visible;
	}, [entry.Visible]);

	// Running story
	useEffect(() => {}, [result]);

	// Creating story
	useEffect(() => {
		if (result === undefined) return;
		if (reloader === undefined) return;
		const check = CheckStory(result);
		if (!check.Sucess) return UILabsWarn(WARNINGS.StoryTypeError, check.Error);

		mountFrame.Name = RemoveExtension(
			props.PreviewEntry.Module.Name,
			Configs.Extensions.Story
		);
		const unmountSignal = new Signal();

		if (clearOutputOnReload) {
			const isSelected =
				selectedPreview === props.PreviewEntry.UID ||
				selectedPreview === props.PreviewEntry.Key;

			if (selectedPreview === undefined || isSelected) {
				LogService.ClearOutput();
			}
		}

		const gotRenderer = MountStory(
			check.Type,
			props.PreviewEntry,
			check.Result,
			mountFrame,
			listenerFrame,
			unmountSignal,
			recoverControlsData,
			setRecoverControlsData
		);
		setRenderer({
			Key: HttpService.GenerateGUID(false),
			MountType: check.Type,
			Renderer: gotRenderer
		});

		const environment = reloader.GetEnvironment();

		if (environment) {
			environment.HookOnDestroyed(() => {
				unmountSignal.Fire();
				unmountSignal.Destroy();

				mountFrame.ClearAllChildren();
			});
		}
	}, [result, reloader]);

	const renderMap: ReactChildren = new Map();
	if (renderer) renderMap.set(renderer.Key, renderer.Renderer);

	const render = (
		<React.Fragment>
			<HolderParenter
				MountFrame={mountFrame}
				ListenerFrame={listenerFrame}
				MountType={renderer?.MountType}
				Entry={entry}
				SetCanReload={setCanReload}
			/>
			{renderMap}
		</React.Fragment>
	);
	return render;
}

export default PreviewController;
