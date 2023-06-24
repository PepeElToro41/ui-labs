import Roact from "@rbxts/roact";
import App from "./App";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import { PluginContext } from "UI/Contexts/PluginContext";

interface PluginProps {
	PluginMouse: PluginMouse | Mouse;
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
	const props = identity<Required<PluginProps>>(setProps(setprops) as Required<PluginProps>);
	const contextValue = useMemo(() => {
		return {
			pluginMouse: props.PluginMouse,
			ExternalControls: {
				setHierarchy: props.ExternalControls.setHierarchy,
				getHierarchy: props.ExternalControls.getHierarchy,
			},
		};
	}, [props.PluginMouse, props.ExternalControls]);
	//Theme effects
	return (
		<PluginContext.Provider value={contextValue}>
			<App></App>
		</PluginContext.Provider>
	);
}
const Plugin = withHooks(PluginCreate);

export = Plugin;
