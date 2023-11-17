import Roact, { mount } from "@rbxts/roact";
import { useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { useStoryRequire } from "Hooks/Previewing/StoryRequire";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectPreview } from "Reflex/StoryPreview/StoryMount";
import { HotReloader } from "Utils/HotReloader";
import { CheckStoryReturn, StoryCheck } from "./Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import { MountStory } from "./Mount";
import { useInstance } from "Hooks/Utils/Instance";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useUnmountEffect } from "@rbxts/pretty-roact-hooks";

interface PreviewControllerProps {
	PreviewEntry: PreviewEntry;
	StoriesFrame: Frame;
}

function PreviewControllerCreate(props: PreviewControllerProps) {
	const node = useSelector(selectNodeFromModule(props.PreviewEntry.Module));
	const result = useStoryRequire(node);
	const widget = useState<DockWidgetPluginGui>();
	const plugin = usePlugin();
	const [renderer, setRenderer] = useState<{ Key: string; Renderer: Roact.Element }>();
	const mountFrame = useInstance("Frame", props.StoriesFrame, {
		Name: RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story),
		Size: UDim2.fromScale(1, 1),
		BackgroundTransparency: 1,
	});

	useEffect(() => {
		if (!props.PreviewEntry.OnWidget) return;
	}, [props.PreviewEntry.OnWidget]);
	useEffect(() => {
		if (!result) return;
		const check = CheckStoryReturn(result.result);
		if (!check.Sucess) return warn(check.Error);
		mountFrame.Name = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);

		const gotRenderer = MountStory(check.Type, check.Result, mountFrame);
		setRenderer({ Key: newproxy(), Renderer: gotRenderer });
	}, [result]);
	const renderMap: Roact.Children = new Map();
	if (renderer) renderMap.set(renderer.Key, renderer.Renderer);

	return <>{renderMap}</>;
}
const PreviewController = withHooks(PreviewControllerCreate);

export = PreviewController;
