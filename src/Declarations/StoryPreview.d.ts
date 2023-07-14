import Roact from "@rbxts/roact";

interface _PrimitiveControls {
	string: string;
	number: number;
	boolean: boolean;
	Color3: Color3;
}
interface _SpecialControls {
	Slider: {
		Props: {
			Min: number;
			Max: number;
			Steps?: number;
		};
		Default: number;
	};
}
type SpecialControls = {
	[K in keyof _SpecialControls]: _SpecialControls[K] & { ControlType: K };
};
type PrimitiveControls = {
	[K in keyof _PrimitiveControls]: { ControlType: K; Default: _PrimitiveControls[K] };
};

type AllControlTypes = PrimitiveControls[keyof PrimitiveControls] | SpecialControls[keyof SpecialControls];

type SetControls = Record<string, AllControlTypes>;
type ReturnControls = Record<string, AllControlTypes | _PrimitiveControls[keyof PrimitiveControls]>;
interface ObjectStory extends UILibsPartial {
	name?: string;
	summary?: string;
	use?: "Roact" | "React";
	controls?: ReturnControls;
	story: ((props: UILabsProps) => Roact.Element) | Roact.Element;
}

type HoarcekatStory = (target: Frame, inputListener: InputSignals | undefined) => Unmounter;
type StoryExecutor = HoarcekatStory | ObjectStory;

type Unmounter = () => void;
type Updater = (props: UILabsProps) => void;
