import React, { useBinding } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectMeasureTool, selectSelectTool, selectShowOutlines, selectMouseRules } from "Reflex/Interface";
import { Div } from "UI/Styles/Div";
import MeasureTool from "./MeasureTool";
import MouseRules from "./MouseRules";
import SelectElements from "./SelectElements";
import { useToggler } from "Hooks/Utils/Toggler";
import ShowOutlines from "./ShowOutlines";
import { useToolbarHovered } from "Context/StoryPanelContext";

interface StoryToolsProps {
	PreviewEntry: PreviewEntry;
}

function StoryTools(props: StoryToolsProps) {
	const [inside, insideApi] = useToggler(false);
	const [anchor, setAnchor] = useBinding<Vector2>(Vector2.zero);

	const isInside = inside && !props.PreviewEntry.OnViewport && !props.PreviewEntry.OnWidget;
	const [toolbarHovered] = useToolbarHovered();

	const measureTool = useSelector(selectMeasureTool);
	const selectTool = useSelector(selectSelectTool);
	const showOutlines = useSelector(selectShowOutlines);
	const mouseRules = useSelector(selectMouseRules);

	return (
		<Div
			Event={{
				MouseEnter: insideApi.enable,
				MouseLeave: insideApi.disable,
			}}
			Change={{
				AbsolutePosition: (frame) => setAnchor(frame.AbsolutePosition),
			}}
			ZIndex={2}
		>
			{measureTool ? <MeasureTool Inside={isInside} Anchor={anchor} /> : undefined}
			{selectTool ? <SelectElements Inside={isInside} Anchor={anchor} PreviewEntry={props.PreviewEntry} /> : undefined}
			{showOutlines ? <ShowOutlines Anchor={anchor} PreviewEntry={props.PreviewEntry} /> : undefined}
			{mouseRules ? <MouseRules Inside={isInside} Anchor={anchor} PreviewEntry={props.PreviewEntry} /> : undefined}
		</Div>
	);
}

export default StoryTools;
