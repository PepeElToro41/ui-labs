import React, { Dispatch, PropsWithChildren, SetStateAction, useBinding, useContext, useMemo, useState } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectActionsPinned } from "Reflex/PluginSettings";
import { CreateTuple } from "Utils/MiscUtils";

interface StoryPanelContext {
	ActionsPinned: boolean;
	ActionsHeight: React.Binding<number>;
	ToolbarHovered: boolean;

	SetActionsPinned: (pinned: boolean) => void;
	SetActionsHeight: (height: number) => void;
	SetToolbarHovered: Dispatch<SetStateAction<boolean>>;
}
const StoryPanelContext = React.createContext({} as StoryPanelContext);

interface StoryPanelProps extends PropsWithChildren {}

export function StoryPanelProvider(props: StoryPanelProps) {
	const actionsPinned = useSelector(selectActionsPinned);
	const [actionsHeight, setActionsHeight] = useBinding<number>(0);
	const [toolbarHovered, setToolbarHovered] = useState(false);
	const { setActionsPinned } = useProducer<RootProducer>();

	const contextValue = useMemo(() => {
		const context: StoryPanelContext = {
			ActionsPinned: actionsPinned,
			ActionsHeight: actionsHeight,
			ToolbarHovered: toolbarHovered,

			SetActionsPinned: setActionsPinned,
			SetActionsHeight: setActionsHeight,
			SetToolbarHovered: setToolbarHovered,
		};
		return context;
	}, [actionsPinned, toolbarHovered]);

	return <StoryPanelContext.Provider value={contextValue}>{props["children"]}</StoryPanelContext.Provider>;
}
export function useActionsPinned() {
	const { ActionsPinned, SetActionsPinned } = useContext(StoryPanelContext);

	return CreateTuple(ActionsPinned, SetActionsPinned);
}

export function useActionsHeight() {
	const { ActionsHeight, SetActionsHeight } = useContext(StoryPanelContext);

	return CreateTuple(ActionsHeight, SetActionsHeight);
}

export function useToolbarHovered() {
	const { ToolbarHovered, SetToolbarHovered } = useContext(StoryPanelContext);

	return CreateTuple(ToolbarHovered, SetToolbarHovered);
}

export function useActionsData() {
	const { ActionsPinned, ActionsHeight } = useContext(StoryPanelContext);

	return CreateTuple(ActionsPinned, ActionsHeight);
}
