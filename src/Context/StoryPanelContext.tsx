import React, {
	type Binding,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useBinding,
	useContext,
	useMemo,
	useState
} from "@rbxts/react";

import { selectActionsPinned } from "Reflex/PluginSettings";
import { CreateTuple } from "Utils/MiscUtils";

import { useProducer, useSelector } from "@rbxts/react-reflex";

interface StoryPanelContext {
	ActionsPinned: boolean;
	ActionsHeight: Binding<number>;
	ToolbarHovered: boolean;
	CanvasHeight: number;

	SetActionsPinned: (pinned: boolean) => void;
	SetActionsHeight: (height: number) => void;
	SetToolbarHovered: Dispatch<SetStateAction<boolean>>;
	SetCanvasHeight: (height: number) => void;
}

const StoryPanelContext = React.createContext({} as StoryPanelContext);

export function StoryPanelProvider(props: PropsWithChildren) {
	const [actionsHeight, setActionsHeight] = useBinding<number>(0);
	const [toolbarHovered, setToolbarHovered] = useState(false);
	const [canvasHeight, setCanvasHeight] = useState(0);

	const { setActionsPinned } = useProducer<RootProducer>();

	const actionsPinned = useSelector(selectActionsPinned);

	const contextValue = useMemo(() => {
		const context: StoryPanelContext = {
			ActionsPinned: actionsPinned,
			ActionsHeight: actionsHeight,
			ToolbarHovered: toolbarHovered,
			CanvasHeight: canvasHeight,

			SetActionsPinned: setActionsPinned,
			SetActionsHeight: (height: number) => {
				setActionsHeight(math.max(height, 0));
			},
			SetToolbarHovered: setToolbarHovered,
			SetCanvasHeight: (height: number) => {
				setCanvasHeight(math.max(height, 0));
			}
		};
		return context;
	}, [actionsPinned, toolbarHovered, canvasHeight]);

	return <StoryPanelContext.Provider value={contextValue}>{props.children}</StoryPanelContext.Provider>;
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

export function useCanvasHeight() {
	const { CanvasHeight, SetCanvasHeight } = useContext(StoryPanelContext);

	return CreateTuple(CanvasHeight, SetCanvasHeight);
}
