import { SetControls, PrimitiveControls, ReturnControls, SpecialControls, _PrimitiveControls } from "Declarations/StoryPreview";
import { $terrify } from "rbxts-transformer-t";

const IsPrimitive = $terrify<keyof _PrimitiveControls>();

function PrimitiveConvert(control: _PrimitiveControls[keyof _PrimitiveControls]) {
	const controlType = typeOf(control);
	if (!IsPrimitive(controlType)) return undefined;
	const controlSet = {
		ControlType: controlType,
		Default: control,
	} as PrimitiveControls[keyof PrimitiveControls];
	return controlSet;
}

export function CreateControls(controls: ReturnControls) {
	const controlList: SetControls = {};
	for (const [key, control] of pairs(controls)) {
		if (typeOf(control) === "table") {
			controlList[key] = control as SpecialControls[keyof SpecialControls];
		} else {
			const valueSet = PrimitiveConvert(control as _PrimitiveControls[keyof _PrimitiveControls]);
			if (!valueSet) {
				warn(`Control in key ${key} is not a supported primitive type, this control will be ignored.`);
				return;
			}
			controlList[key] = valueSet;
		}
	}
	return controlList;
}

export function DecodeControls(story: SetControls) {}
