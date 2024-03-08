import { useProducer } from "@rbxts/react-reflex";
import React, { useEffect } from "@rbxts/react";
import App from "./App";

interface PluginProps {
	Plugin: Plugin;
	DockWidget: DockWidgetPluginGui;
}

function Plugin(props: PluginProps) {
	const { setPlugin, setWidget } = useProducer<RootProducer>();

	useEffect(() => {
		setPlugin(props.Plugin);

		setWidget(props.DockWidget);
	}, [props.Plugin, props.DockWidget]);

	return <App></App>;
}

export default Plugin;
