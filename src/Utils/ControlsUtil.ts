import { $terrify } from "rbxts-transformer-t";
import Signal from "./Signal";
import { _UILabsInternal as UL } from "@rbxts/ui-labs/out/Internal";
import { SpecialControls } from "@rbxts/ui-labs";

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

export function DecodeControls(story: UL.SetControls) {}
