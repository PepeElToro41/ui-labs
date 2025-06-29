import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useRef } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { createPortal } from "@rbxts/react-roblox";
import { HttpService } from "@rbxts/services";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectPluginWidget } from "Reflex/Plugin";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Widget(props: StoryHolderProps) {
	const plugin = usePlugin();
	const mountRef = useRef<Frame>();

	const { unmountStory } = useProducer<RootProducer>();
	const pluginWidget = useSelector(selectPluginWidget);
	const preview = props.PreviewEntry;
	const storyName = RemoveExtension(
		preview.Module.Name,
		Configs.Extensions.Story
	);
	const onViewport = preview.OnViewport;

	useDeferLifetime(props, 2);
	const dockWidget = useMemo(() => {
		if (plugin === undefined) return;
		const widgetSettings = new DockWidgetPluginGuiInfo(
			Enum.InitialDockState.Float,
			true,
			true,
			pluginWidget?.AbsoluteSize.X,
			pluginWidget?.AbsoluteSize.Y
		);
		const newWidget = plugin.CreateDockWidgetPluginGui(
			HttpService.GenerateGUID(),
			widgetSettings
		);
		newWidget.Name = storyName;
		newWidget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
		return newWidget;
	}, [plugin]);

	useEffect(() => {
		if (dockWidget === undefined) return;
		dockWidget.Title = `Story: ${storyName}`;
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
		if (dockWidget === undefined) return;
		const focus = dockWidget.WindowFocused.Connect(() => {
			if (dockWidget === undefined) return;
			props.SetCanReload(true);
		});
		const unfocus = dockWidget.WindowFocusReleased.Connect(() => {
			if (dockWidget === undefined) return;
			props.SetCanReload(false);
		});
		return () => {
			focus.Disconnect();
			unfocus.Disconnect();
		};
	}, [dockWidget, props.SetCanReload]);

	useEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		if (onViewport) return;

		props.MountFrame.Parent = holder;
		props.ListenerFrame.Parent = holder;
	}, [mountRef, onViewport]);

	useUnmountEffect(() => {
		if (dockWidget !== undefined) {
			dockWidget.Enabled = false;
			dockWidget.Destroy();
		}
	});

	return dockWidget === undefined ? (
		<Div key={storyName}>
			<Div key={"Story"} ref={mountRef} />
		</Div>
	) : (
		createPortal(<Div key={"Story"} ref={mountRef} />, dockWidget)
	);
}

export default Widget;
