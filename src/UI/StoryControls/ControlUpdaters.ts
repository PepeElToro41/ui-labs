import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { DatatypeControl, Datatypes } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { PrimitiveControl, Primitives } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";

export type ControlUpdater<T extends ObjectControl> = (
	key: string,
	control: T,
	current: T["ControlValue"],
	value: T["ControlValue"],
	parametrized: ParametrizedControls
) => T["ControlValue"];

type PrimitiveRecovererMap = {
	[K in keyof Primitives]: ControlUpdater<PrimitiveControl<K>>;
};
type DatatypeRecovererMap = {
	[K in keyof Datatypes]: ControlUpdater<DatatypeControl<K>>;
};
type AdvancedRecovererMap = {
	[K in keyof AdvancedTypes.All]: ControlUpdater<AdvancedTypes.All[K]>;
};

export type AllRecovererMap = PrimitiveRecovererMap & DatatypeRecovererMap & AdvancedRecovererMap;
