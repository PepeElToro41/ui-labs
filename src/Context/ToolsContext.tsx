import React, { PropsWithChildren, SetStateAction, useMemo, useState } from "@rbxts/react";
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
	const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>("Floating");

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
			SetToolbarPosition: setToolbarPosition,
			SetToolButtonsActive: setToolButtonsActive,
		};
		return context;
	}, [toolbarPosition, toolButtonsActive]);

	return <ToolsContext.Provider value={contextValue}>{props.children}</ToolsContext.Provider>;
}

export function useToolsContext() {
	const context = React.useContext(ToolsContext);
	return context;
}
