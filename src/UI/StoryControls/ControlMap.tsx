import React from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { DatatypeControl, Datatypes } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { PrimitiveControl, Primitives } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import StringControl from "./Controls/Primitives/String";
import NumberControl from "./Controls/Primitives/Number";
import BooleanControl from "./Controls/Primitives/Boolean";
import Color3Control from "./Controls/Datatypes/Color3";
import SliderControl from "./Controls/Advanced/Slider";
import ChooseControl from "./Controls/Advanced/OptionList/Choose";
import EnumListControl from "./Controls/Advanced/OptionList/EnumList";
import _ObjectControl from "./Controls/Advanced/Object";
import RGBAControl from "./Controls/Advanced/RGBA";

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
	Boolean: BooleanControl,
};

const DatatypeControlMap: DatatypeControlMap = {
	Color3: Color3Control,
	/*
	UDim2: () => {
		return <></>;
	},
	UDim: () => {
		return <></>;
	},
	CFrame: () => {
		return <></>;
	},
	Vector2: () => {
		return <></>;
	},
	Vector3: () => {
		return <></>;
	},*/
};

const AdvancedControlMap: AdvancedControlMap = {
	Choose: ChooseControl,
	EnumList: EnumListControl,
	RGBA: RGBAControl,
	Slider: SliderControl,
	Object: _ObjectControl as ControlFactory<AdvancedTypes.Object>,
};

export const AllControlMap: AllControlMap = {
	...PrimitiveControlMap,
	...DatatypeControlMap,
	...AdvancedControlMap,
};
