import React, { useEffect, useMemo } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useMousePos } from "Hooks/Context/UserInput";
import { selectMouseIconActions, selectStoryLock } from "Reflex/Interface";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";

import { MouseActionsList } from "./ActionsList";
import MouseActionLabel from "./MouseActionLabel";

interface MouseIconActionsProps {}

function MouseIconActions(props: MouseIconActionsProps) {
	const mousePos = useMousePos();
	const { addMouseIconAction, removeMouseIconAction } = useProducer<RootProducer>();
	const mouseActions = useSelector(selectMouseIconActions);
	const storyLock = useSelector(selectStoryLock);

	useEffect(() => {
		if (storyLock.isEmpty()) {
			removeMouseIconAction("StoryLocked");
		} else {
			addMouseIconAction("StoryLocked");
		}
	}, [storyLock]);

	const actionsLabel = useMemo(() => {
		const elements: React.Element[] = [];
		mouseActions.forEach((action) => {
			if (!(action in MouseActionsList)) return;
			const actionInfo = MouseActionsList[action as keyof typeof MouseActionsList];
			elements.push(<MouseActionLabel ActionInfo={actionInfo} />);
		});
		return elements;
	}, [mouseActions]);

	return (
		<Div
			Size={UDim2.fromOffset(0, 27)}
			AutomaticSize={Enum.AutomaticSize.X}
			Position={mousePos.map((pos) => UDim2.fromOffset(pos.X + 20, pos.Y + 20))}
			AnchorPoint={new Vector2(1, 0)}
		>
			<LeftList Padding={new UDim(0, 2)} VerticalAlignment={Enum.VerticalAlignment.Center} />
			{actionsLabel}
		</Div>
	);
}

export default MouseIconActions;
