import React, { Binding } from "@rbxts/react";
import { ComponentHighlightRenderes, GuiInstances } from "./Mapping";
import FrameHighlight from "./ClassTypes/Frame";

interface ComponentHighlightProps {
	UIComponent: GuiObject;
	Inset: Binding<Vector2>;
	Holder: GuiObject;
}

// This component will highlight a GuiObject
function ComponentHighlight(props: ComponentHighlightProps) {
	const className = props.UIComponent.ClassName as keyof GuiInstances;
	const Renderer = ComponentHighlightRenderes[className] ?? FrameHighlight;

	return <Renderer UIComponent={props.UIComponent as any} Inset={props.Inset} Holder={props.Holder}></Renderer>;
}

export default ComponentHighlight;
