import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import Plugin from "UI/Main/Plugin";

if (script.Parent?.FindFirstChild("Settings.uilabs")) {
	const parent = script.Parent as unknown as { ["Settings.uilabs"]: ModuleScript };
	parent["Settings.uilabs"].Destroy();
}

if (!RunService.IsRunning() || RunService.IsEdit()) {
	const toolbar = plugin.CreateToolbar("UI Labs");
	const pluginButton = toolbar.CreateButton("UI Labs", "Open UI Labs", "rbxassetid://13858107432");
	const stopButton = toolbar.CreateButton("Stop", "Stop UI Labs", "rbxassetid://13960086023");
	const DockWidget = plugin.CreateDockWidgetPluginGui(
		"StoryBook",
		new DockWidgetPluginGuiInfo(Enum.InitialDockState.Top, true),
	);
	DockWidget.Title = "UI Labs - Storybook";
	DockWidget.Name = "UILabs";
	DockWidget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	let isOpen = false;
	const WarnOnOpen = (warnMsg: string) => {
		if (isOpen) {
			//warn(warnMsg);
		}
	};
	const PluginApp = (
		<Plugin
			PluginObject={plugin}
			DockWidget={DockWidget}
			WarnOnOpen={WarnOnOpen}
			ExternalControls={{
				setHierarchy: (Hierarchy) => {},
				getHierarchy: () => {
					return Configs.DefaultHierarchy;
				},
				getSettings: () => {
					return identity<PluginSettings["Settings"]>({
						ModuleBindType: "Path",
					});
				},
			}}
		></Plugin>
	);
	let PluginHandler: Roact.Tree | undefined = undefined;
	const buttonConnection = pluginButton.Click.Connect(() => {
		DockWidget.Enabled = !DockWidget.Enabled;
	});
	const stopConnection = stopButton.Click.Connect(() => {
		stopButton.SetActive(false);
		DockWidget.Enabled = false;
		if (PluginHandler) {
			Roact.unmount(PluginHandler);
			PluginHandler = undefined;
		}
	});
	DockWidget.BindToClose(() => {
		DockWidget.Enabled = false;
	});
	const dockEnableConnection = DockWidget.GetPropertyChangedSignal("Enabled").Connect(() => {
		pluginButton.SetActive(DockWidget.Enabled);
		isOpen = DockWidget.Enabled;
		if (DockWidget.Enabled && !PluginHandler) {
			PluginHandler = Roact.mount(PluginApp, DockWidget, "Plugin");
		}
	});
	plugin.Unloading.Connect(() => {
		if (PluginHandler) {
			Roact.unmount(PluginHandler);
		}
		buttonConnection.Disconnect();
		stopConnection.Disconnect();
		dockEnableConnection.Disconnect();
	});
}
