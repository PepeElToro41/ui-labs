import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { DatatypeControl, Datatypes } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { PrimitiveControl, Primitives } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { ApplyFilters } from "Utils/StringUtils";

export type ControlRecoverer<T extends ObjectControl> = (
	key: string,
	control: T,
	oldControl: T,
	value: T["ControlValue"],
	parametrized: ParametrizedControls,
) => void;

type PrimitiveRecovererMap = {
	[K in keyof Primitives]: ControlRecoverer<PrimitiveControl<K>>;
};
type DatatypeRecovererMap = {
	[K in keyof Datatypes]: ControlRecoverer<DatatypeControl<K>>;
};
type AdvancedRecovererMap = {
	[K in keyof AdvancedTypes.All]: ControlRecoverer<AdvancedTypes.All[K]>;
};

export type AllRecovererMap = PrimitiveRecovererMap & DatatypeRecovererMap & AdvancedRecovererMap;

const PrimitiveRecovererMap: PrimitiveRecovererMap = {
	String: (key, control, _, value, parametrized) => {
		let filtered = ApplyFilters(value, control.Filters ?? []);
		parametrized[key] = filtered;
	},
	Number: (key, control, _, value, parametrized) => {
		const clamped = math.clamp(value, control.Min ?? -math.huge, control.Max ?? math.huge);
		parametrized[key] = clamped;
	},
	Boolean: (key, control, _, value, parametrized) => {
		parametrized[key] = value;
	},
};

const DatatypeRecovererMap: DatatypeRecovererMap = {
	Color3: (key, control, _, value, parametrized) => {
		parametrized[key] = value;
	},
};

const AdvancedRecovererMap: AdvancedRecovererMap = {
	Choose: (key, control, oldControl, value, parametrized) => {
		const oldIndex = oldControl.List.findIndex((item) => item === value);
		if (oldIndex === -1) return;
		if (control.List.size() <= oldIndex) return;

		parametrized[key] = control.List[oldIndex];
	},
	EnumList: (key, control, oldControl, value, parametrized) => {
		let oldKey = undefined;
		for (const [key, item] of pairs(oldControl.List)) {
			if (item === value) {
				oldKey = key;
				break;
			}
		}
		if (oldKey === undefined) return;
		const newKey = control.List[oldKey];
		if (newKey === undefined) return;
		parametrized[key] = newKey;
	},
	RGBA: (key, control, _, value, parametrized) => {
		parametrized[key] = value;
	},
	Slider: (key, control, _, value, parametrized) => {
		const clamped = math.clamp(value, control.Min ?? -math.huge, control.Max ?? math.huge);
		//TODO: Respect step snapping
		parametrized[key] = clamped;
	},
	Object: (key, control, _, value: Instance, parametrized) => {
		if (value === undefined) {
			parametrized[key] = undefined;
			return;
		}
		if (!value.IsA(control.ClassName)) return;
		if (control.Predicator) {
			if (!control.Predicator(value)) return;
		}
		parametrized[key] = value;
	},
};

export const AllRecovererMap: AllRecovererMap = {
	...PrimitiveRecovererMap,
	...DatatypeRecovererMap,
	...AdvancedRecovererMap,
};
