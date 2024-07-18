import React, { useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useStoryRequire } from "UI/StoryPreview/PreviewController/StoryRequire";
import { CheckStoryReturn, StoryCheck } from "./Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import { MountStory } from "./Mount";
import { useInstance } from "Hooks/Utils/Instance";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import HolderParenter from "./Holders/HolderParenter";

interface PreviewControllerProps {
	PreviewEntry: PreviewEntry;
}

function PreviewController(props: PreviewControllerProps) {
	const [result, reloader] = useStoryRequire(props.PreviewEntry);
	const [renderer, setRenderer] = useState<{ Key: string; MountType: MountType; Renderer: React.Element }>();

	const entry = props.PreviewEntry;
	const key = props.PreviewEntry.Key;

	const { setMountData } = useProducer<RootProducer>();
	const plugin = usePlugin();

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
		const check = CheckStoryReturn(result);
		if (!check.Sucess) return warn("UI-Labs: " + check.Error);
		mountFrame.Name = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);
		const gotRenderer = MountStory(check.Type, props.PreviewEntry, check.Result, mountFrame);
		setRenderer({ Key: tostring(newproxy()), MountType: check.Type, Renderer: gotRenderer });
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
