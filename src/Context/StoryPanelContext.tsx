import React, { Dispatch, PropsWithChildren, SetStateAction, useBinding, useContext, useMemo, useState } from "@rbxts/react";
import { CreateTuple } from "Utils/MiscUtils";

interface StoryPanelContext {
	ActionsPinned: boolean;
	ActionsHeight: React.Binding<number>;

	SetActionsPinned: Dispatch<SetStateAction<boolean>>;
	SetActionsHeight: (height: number) => void;
}
const StoryPanelContext = React.createContext({} as StoryPanelContext);

interface StoryPanelProps extends PropsWithChildren {}

export function StoryPanelProvider(props: StoryPanelProps) {
	const [actionsPinned, setActionsPinned] = useState(false);
	const [actionsHeight, setActionsHeight] = useBinding<number>(0);

	const contextValue = useMemo(() => {
		const context: StoryPanelContext = {
			ActionsPinned: actionsPinned,
			ActionsHeight: actionsHeight,

			SetActionsPinned: setActionsPinned,
			SetActionsHeight: setActionsHeight,
		};
		return context;
	}, [actionsPinned]);

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
export function useActionsData() {
	const { ActionsPinned, ActionsHeight } = useContext(StoryPanelContext);

	return CreateTuple(ActionsPinned, ActionsHeight);
}
