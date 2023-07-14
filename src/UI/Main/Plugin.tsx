import Roact from "@rbxts/roact";
import App from "./App";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import { PluginContext } from "UI/Contexts/PluginContext";
import { TweenService } from "@rbxts/services";

interface PluginProps {
	PluginObject?: typeof plugin;
	DockWidget?: DockWidgetPluginGui;
	WarnOnOpen?: (warnMsg: string) => void;
	ExternalControls: {
		setHierarchy: (settings: PluginHierarchy) => void;
		getHierarchy: () => PluginHierarchy;
		getSettings: () => PluginSettings["Settings"];
	};
}

function setProps(props: PluginProps) {
	return props;
}

function PluginCreate(setprops: PluginProps) {
	const newHum = new Instance("Humanoid");
	TweenService.Create(newHum, new TweenInfo(1), { CameraOffset: new Vector3(0, 0, 0) });

	const props = identity<Required<PluginProps>>(setProps(setprops) as Required<PluginProps>);
	const contextValue = useMemo(() => {
		return {
			PluginObject: props.PluginObject,
			WarnOnOpen: props.WarnOnOpen ?? warn,
			DockWidget: props.DockWidget,
			ExternalControls: {
				setHierarchy: props.ExternalControls.setHierarchy,
				getHierarchy: props.ExternalControls.getHierarchy,
			},
		};
	}, [props.PluginObject, props.ExternalControls, props.WarnOnOpen]);
	//Theme effects
	return (
		<PluginContext.Provider value={contextValue}>
			<App></App>
		</PluginContext.Provider>
	);
}
const Plugin = withHooks(PluginCreate);

export = Plugin;
