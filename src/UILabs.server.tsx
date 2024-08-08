_G.__ROACT_17_MOCK_SCHEDULER__ = undefined;

import { RunService } from "@rbxts/services";
import React from "@rbxts/react";
import Plugin from "UI/Plugin";
import { Root, createLegacyRoot, createPortal } from "@rbxts/react-roblox";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import { IsLocalPlugin } from "Utils/MiscUtils";
import { Div } from "UI/Styles/Div";

/* eslint-disable roblox-ts/lua-truthiness */

if (!RunService.IsRunning() || RunService.IsEdit()) {
	const isLocal = IsLocalPlugin(plugin);
	const toolbar = plugin.CreateToolbar(isLocal ? "UI Labs (DEV)" : "UI Labs");
	const pluginButton = toolbar.CreateButton("UI Labs", "Open UI Labs", isLocal ? "rbxassetid://16652065460" : "rbxassetid://13858107432");
	const stopButton = toolbar.CreateButton("Stop", "Stop UI Labs", "rbxassetid://13960086023");

	const dockWidget = plugin.CreateDockWidgetPluginGui(
		isLocal ? "UILabs_DEV" : "UILabs",
		new DockWidgetPluginGuiInfo(Enum.InitialDockState.Left, false, true, 0, 0),
	);

	dockWidget.Title = "UI Labs - Storybook";
	dockWidget.Name = isLocal ? "UILabs(DEV)" : "UILabs";
	dockWidget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	let isOpen = false;

	let pluginRoot: Root | undefined = undefined;

	const buttonConnection = pluginButton.Click.Connect(() => {
		dockWidget.Enabled = !dockWidget.Enabled;
	});
	const stopConnection = stopButton.Click.Connect(() => {
		stopButton.SetActive(false);
		dockWidget.Enabled = false;
		if (pluginRoot) {
			pluginRoot.unmount();
			pluginRoot = undefined;
			RootProducer.resetState();
		}
	});

	dockWidget.BindToClose(() => {
		dockWidget.Enabled = false;
	});
	const dockEnableConnection = dockWidget.GetPropertyChangedSignal("Enabled").Connect(() => {
		pluginButton.SetActive(dockWidget.Enabled);
		isOpen = dockWidget.Enabled;
		if (dockWidget.Enabled && !pluginRoot) {
			const pluginApp = (
				<ReflexProvider producer={RootProducer}>
					<Div key={"App"}>
						<Plugin Plugin={plugin} DockWidget={dockWidget}></Plugin>
					</Div>
				</ReflexProvider>
			);

			pluginRoot = createLegacyRoot(new Instance("Folder"));
			pluginRoot.render(createPortal(pluginApp, dockWidget));
		}
	});
	plugin.Unloading.Connect(() => {
		if (pluginRoot) {
			pluginRoot.unmount();
		}
		RootProducer.resetState();
		buttonConnection.Disconnect();
		stopConnection.Disconnect();
		dockEnableConnection.Disconnect();
	});
}
