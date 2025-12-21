import Signal from "@rbxts/lemon-signal";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { useSignal } from "Hooks/Utils/Signal";

interface WidgetStateContext {
	WidgetFocused: boolean;
	ViewportFocused: boolean;
	OnViewportFocusChanged: Signal<[boolean]>;
	OnWidgetFocusChanged: Signal<[boolean]>;
}

const WidgetStateContext = React.createContext<WidgetStateContext>({
	WidgetFocused: true,
	ViewportFocused: true,
	OnViewportFocusChanged: new Signal<boolean>(),
	OnWidgetFocusChanged: new Signal<boolean>()
});

interface WidgetStateProviderProps extends React.PropsWithChildren {
	DockWidget: DockWidgetPluginGui;
}

export function WidgetStateProvider(props: WidgetStateProviderProps) {
	const [widgetFocused, setWidgetFocused] = useState(false);
	const [viewportFocused, setViewportFocused] = useState(false);

	const focusedSignal = useSignal<[boolean]>();
	const viewportFocusedSignal = useSignal<[boolean]>();
	useEffect(() => {
		const widgetFocused = props.DockWidget.WindowFocused.Connect(() => {
			focusedSignal.Fire(true);
			setWidgetFocused(true);
		});
		const widgetFocusReleased = props.DockWidget.WindowFocusReleased.Connect(() => {
			focusedSignal.Fire(false);
			setWidgetFocused(false);
		});

		const viewportFocused = UserInputService.WindowFocused.Connect(() => {
			viewportFocusedSignal.Fire(true);
			setViewportFocused(true);
		});
		const viewportFocusReleased = UserInputService.WindowFocusReleased.Connect(() => {
			viewportFocusedSignal.Fire(false);
			setViewportFocused(false);
		});

		return () => {
			widgetFocused.Disconnect();
			widgetFocusReleased.Disconnect();
			viewportFocused.Disconnect();
			viewportFocusReleased.Disconnect();
		};
	}, [props.DockWidget]);

	const context = useMemo(() => {
		return {
			WidgetFocused: widgetFocused,
			ViewportFocused: viewportFocused,

			OnViewportFocusChanged: viewportFocusedSignal,
			OnWidgetFocusChanged: focusedSignal
		};
	}, [widgetFocused, viewportFocused]);

	return <WidgetStateContext.Provider value={context}>{props.children}</WidgetStateContext.Provider>;
}

export function useWidgetStateContext() {
	const context = React.useContext(WidgetStateContext);
	return context;
}
