import React, { Binding } from "@rbxts/react";

import FrameHighlight from "./ClassTypes/Frame";
import ImageButtonHighlight from "./ClassTypes/ImageButton";
import ImageLabelHighlight from "./ClassTypes/ImageLabel";
import TextButtonHighlight from "./ClassTypes/TextButton";
import TextBoxHighlight from "./ClassTypes/TextInput";
import TextLabelHighlight from "./ClassTypes/TextLabel";

export interface HighlightProps<T extends GuiObject> {
	UIComponent: T;
	Inset: Binding<Vector2>;
	Holder: GuiObject;
}

export type GuiInstances = ExtractMembers<CreatableInstances, GuiObject>;

type ComponentRenderes = {
	[K in keyof GuiInstances]?: React.FunctionComponent<HighlightProps<GuiInstances[K]>>;
};

export const ComponentHighlightRenderes: ComponentRenderes = {
	Frame: FrameHighlight,
	TextLabel: TextLabelHighlight,
	TextButton: TextButtonHighlight,
	TextBox: TextBoxHighlight,
	ImageLabel: ImageLabelHighlight,
	ImageButton: ImageButtonHighlight
};
