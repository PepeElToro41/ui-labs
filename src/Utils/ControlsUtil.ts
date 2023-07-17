import { $terrify } from "rbxts-transformer-t";
import Signal from "./Signal";
import { _UILabsInternal as UL } from "@rbxts/ui-labs/out/Internal";
import { SpecialControls } from "@rbxts/ui-labs";

export class ControlBinder {
	//Properties
	readonly Changed = new Signal<(value: unknown) => void>();
	Current: unknown;
	Control: UL.AllControlTypes;
	//Methods
	constructor(control: UL.AllControlTypes) {
		this.Control = control;
		this.Current = control.Default;
	}
	Reset() {
		this.Set(this.Control.Default);
	}
	Set(value: unknown) {
		this.Current = value;
		this.Changed.Fire(value);
	}
	Destroy() {
		this.Changed.Destroy();
	}
}

const IsPrimitive = $terrify<keyof UL._PrimitiveControls>();

function PrimitiveConvert(control: UL._PrimitiveControls[keyof UL._PrimitiveControls]) {
	const controlType = typeOf(control);
	if (!IsPrimitive(controlType)) return undefined;
	const controlSet = {
		ControlType: controlType,
		Default: control,
	} as UL.PrimitiveControls[keyof UL.PrimitiveControls];
	return controlSet;
}

export function CreateControls(controls: UL.ReturnControls) {
	const controlList: UL.SetControls = {};
	for (const [key, control] of pairs(controls)) {
		if (typeOf(control) === "table") {
			controlList[key] = control as SpecialControls[keyof SpecialControls];
		} else {
			const valueSet = PrimitiveConvert(control as UL._PrimitiveControls[keyof UL._PrimitiveControls]);
			if (!valueSet) {
				warn(`Control in key ${key} is not a supported primitive type, this control will be ignored.`);
				return;
			}
			controlList[key] = valueSet;
		}
	}
	return controlList;
}

export function DecodeControls(story: UL.SetControls) {}
