import Roact from "@rbxts/roact";

interface AllSpecialControls {
	Slider: {
		Default: number;
		Min: number;
		Max: number;
		Steps?: number;
	};
	Choose: {
		Default?: number;
		Options: Exclude<ControlType, boolean>[];
	};
}
type SpecialControls = {
	[K in keyof AllSpecialControls]: AllSpecialControls[K] & { ControlName: K };
};

type Controls = Record<string, AdvancedControlType>;
type AdvancedControlType = ControlType | SpecialControls[keyof SpecialControls];
type ControlType = PrimitiveControlType | Color3;
type PrimitiveControls = Record<string, PrimitiveControlType>;
type PrimitiveControlType = string | number | boolean;

type HoarcekatStory = (mousePos: Vector2) => Callback;
interface FlipbookStory {
	name?: string;
	summary?: string;
	controls?: PrimitiveControls;
	story: (props: PrimitiveControls) => {};
}
interface UILabsStory {
	Name: string;
	Controls: Controls;
	Story: (props: Controls) => Roact.Element;
}

type IsStoryHandle = HoarcekatStory | FlipbookStory | UILabsStory;
