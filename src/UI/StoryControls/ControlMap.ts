import React from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { DatatypeControl, Datatypes } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { PrimitiveControl, Primitives } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import _ObjectControl from "./Controls/Advanced/Object";
import ChooseControl from "./Controls/Advanced/OptionList/Choose";
import EnumListControl from "./Controls/Advanced/OptionList/EnumList";
import RGBAControl from "./Controls/Advanced/RGBA";
import SliderControl from "./Controls/Advanced/Slider";
import Color3Control from "./Controls/Datatypes/Color3";
import BooleanControl from "./Controls/Primitives/Boolean";
import NumberControl from "./Controls/Primitives/Number";
import StringControl from "./Controls/Primitives/String";

declare global {
	export interface ControlElementProps<T extends ObjectControl> {
		Control: T;
		Current: T["ControlValue"];
		Apply: (val: T["ControlValue"]) => void;
	}
	export type ControlFactory<T extends ObjectControl> = (props: ControlElementProps<T>) => React.Element;
}

type PrimitiveControlMap = {
	[K in keyof Primitives]: ControlFactory<PrimitiveControl<K>>;
};
type DatatypeControlMap = {
	[K in keyof Datatypes]: ControlFactory<DatatypeControl<K>>;
};
type AdvancedControlMap = {
	[K in keyof AdvancedTypes.All]: ControlFactory<AdvancedTypes.All[K]>;
};
type AllControlMap = PrimitiveControlMap & DatatypeControlMap & AdvancedControlMap;

const PrimitiveControlMap: PrimitiveControlMap = {
	String: StringControl,
	Number: NumberControl,
	Boolean: BooleanControl
};

const DatatypeControlMap: DatatypeControlMap = {
	Color3: Color3Control
};

const AdvancedControlMap: AdvancedControlMap = {
	Choose: ChooseControl,
	EnumList: EnumListControl,
	RGBA: RGBAControl,
	Slider: SliderControl,
	Object: _ObjectControl as ControlFactory<AdvancedTypes.Object>
};

export const AllControlMap: AllControlMap = {
	...PrimitiveControlMap,
	...DatatypeControlMap,
	...AdvancedControlMap
};
