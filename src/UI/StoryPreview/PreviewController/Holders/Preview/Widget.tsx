import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import React, { useEffect, useMemo, useRef } from "@rbxts/react";
import { HttpService } from "@rbxts/services";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectPluginWidget } from "Reflex/Plugin";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";
import { createPortal } from "@rbxts/react-roblox";

const MountTitles: Record<MountType, string> = {
	Functional: "Function",
	RoactLib: "Roact",
	ReactLib: "React",
};

function Widget(props: StoryHolderProps) {
	const plugin = usePlugin();
	const mountRef = useRef<Frame>();

	const { unmountStory } = useProducer<RootProducer>();
	const pluginWidget = useSelector(selectPluginWidget);
	const preview = props.PreviewEntry;
	const offset = preview.Offset;
	const scale = preview.Zoom;
	const storyName = RemoveExtension(preview.Module.Name, Configs.Extensions.Story);
	const onViewport = preview.OnViewport;

	useDeferLifetime(props);
	const dockWidget = useMemo(() => {
		if (plugin === undefined) return;
		const widgetSettings = new DockWidgetPluginGuiInfo(
			Enum.InitialDockState.Float,
			true,
			true,
			pluginWidget?.AbsoluteSize.X,
			pluginWidget?.AbsoluteSize.Y,
		);
		const newWidget = plugin.CreateDockWidgetPluginGui(HttpService.GenerateGUID(), widgetSettings);
		newWidget.Name = storyName;
		newWidget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
		return newWidget;
	}, [plugin]);

	useEffect(() => {
		if (dockWidget === undefined) return;
		const mountTitle = props.MountType === undefined ? "" : MountTitles[props.MountType];
		dockWidget.Title = `${mountTitle} Story: ${storyName}`;
	}, [props.MountType, dockWidget]);

	useEffect(() => {
		if (dockWidget === undefined) return;
		dockWidget.BindToClose(() => {
			unmountStory(preview.Key);
			dockWidget.Enabled = false;
		});
		return () => dockWidget.BindToClose(undefined);
	}, [dockWidget, preview]);

	useEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		props.MountFrame.Parent = holder;
	}, [mountRef, onViewport]);

	useUnmountEffect(() => {
		if (dockWidget !== undefined) {
			dockWidget.Enabled = false;
		}
	});

	return dockWidget === undefined ? (
		<Div key={storyName}>
			<Div key={"Story"} Reference={mountRef} />
		</Div>
	) : (
		createPortal(<Div key={"Story"} Reference={mountRef} />, dockWidget)
	);
}

export default Widget;
