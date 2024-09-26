import React, { PropsWithChildren, SetStateAction, useEffect, useMemo, useState } from "@rbxts/react";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import { ToolButtonType, ToolButtonsList } from "UI/StoryOverlay/IconToolbar/ToolButtonsList";

export type ToolsButtonActive = Record<ToolButtonType, boolean>;

type ToolbarPosition = "Floating" | "Anchored";

interface ToolsContext {
	ToolbarPosition: ToolbarPosition;
	ToolButtonsActive: ToolsButtonActive;

	SetToolbarPosition: (newPosition: ToolbarPosition) => void;
	SetToolButtonsActive: (newInfo: SetStateAction<ToolsButtonActive>) => void;
}

const ToolsContext = React.createContext({} as ToolsContext);

interface ToolsProps extends PropsWithChildren {}

export function ToolsProvider(props: ToolsProps) {
	const plugin = usePlugin();

	const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>(
		(plugin?.GetSetting("ToolbarPosition") as ToolbarPosition) || "Floating"
	);

	// in case plugin does not exist straight away for whatever reason
	useEffect(() => {
		if (plugin !== undefined) {
			setToolbarPosition((plugin?.GetSetting("ToolbarPosition") as ToolbarPosition) || "Floating")
		}
	}, [plugin]);

	const [toolButtonsActive, setToolButtonsActive] = useState<ToolsButtonActive>(() => {
		const active = {} as ToolsButtonActive;
		for (const buttonType of ToolButtonsList) {
			active[buttonType.Name] = true;
		}
		return active;
	});

	const contextValue = useMemo(() => {
		const context: ToolsContext = {
			ToolbarPosition: toolbarPosition,
			ToolButtonsActive: toolButtonsActive,
			SetToolbarPosition: (position: ToolbarPosition) => {
				plugin?.SetSetting("ToolbarPosition", position);
				setToolbarPosition(position);
			},
			SetToolButtonsActive: setToolButtonsActive,
		};
		return context;
	}, [toolbarPosition, toolButtonsActive, plugin]);

	return <ToolsContext.Provider value={contextValue}>{props.children}</ToolsContext.Provider>;
}

export function useToolsContext() {
	const context = React.useContext(ToolsContext);
	return context;
}
