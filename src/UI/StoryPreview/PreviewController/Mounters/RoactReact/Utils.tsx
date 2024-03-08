import { useProducer } from "@rbxts/react-reflex";
import { useCallback, useEffect, useMemo } from "@rbxts/react";
import { Datatype, InferControlType, Primitive } from "@rbxts/ui-labs";
import { ControlGroup } from "@rbxts/ui-labs/src/ControlTypings/ControlUtils";
import { IsDatatype } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { IsPrimitive } from "@rbxts/ui-labs/src/ControlTypings/Primitives";
import { ObjectControl, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { InferControlGroup } from "@rbxts/ui-labs/src/Typing";

declare global {
	type ControlValue = InferControlType<ObjectControl>;
	type ConvertedControlList = Record<string, ObjectControl>;

	type ConvertedControls = Record<string, ObjectControl | ControlGroup<ConvertedControlList>>;
	type ParametrizedControls = Record<string, ControlValue | InferControlGroup>;
}

type TypeOfPrimitive = keyof typeof Primitive;
type TypeOfDatatype = keyof typeof Datatype;

//Typescript kinda hated me here (I refuse to use any or never)
type Converter<T extends CheckableTypes[keyof CheckableTypes]> = (def: T) => ObjectControl;

//Converts any control that is expressed as a primive ("", 10, false)
function ConvertPrimitive<T extends TypeOfPrimitive>(control: CheckablePrimitives[T], primitiveType: T) {
	const converter = Primitive[primitiveType] as Converter<CheckablePrimitives[T]>;
	return converter(control);
}
//Converts any control that is expressed as a Datatype (new Color3,  new Vector3)
function ConvertDatatype<T extends TypeOfDatatype>(control: CheckableTypes[T], datatypeType: T) {
	const converter = Datatype[datatypeType] as Converter<CheckableTypes[T]>;
	return converter(control);
}

//This function checks anything that is expressed as a literal in the story and converts it to a control
function ConvertLiterals(controls: ReturnControls) {
	const converted: ConvertedControls = {};

	for (const [name, control] of pairs(controls)) {
		const controlType = typeOf(control);
		let setControl = control;

		if (controlType in Primitive) {
			setControl = ConvertPrimitive(control as IsPrimitive, controlType as TypeOfPrimitive);
		} else if (controlType in Datatype) {
			setControl = ConvertDatatype(control as IsDatatype, controlType as TypeOfDatatype);
		} else if (controlType !== "table") {
			warn(`Literal ${controlType} couldn't be converted to a Control`);
			continue;
		}
		const finalControl = setControl as ObjectControl | ControlGroup<ConvertedControlList>;

		if (finalControl.EntryType === "ControlGroup") {
			converted[name] = {
				...finalControl,
				Controls: ConvertLiterals(finalControl.Controls) as ConvertedControlList,
			};
			continue;
		}
		converted[name] = finalControl;
	}
	return converted;
}

export function useControls(returnedControls: ReturnControls) {
	const controls = useMemo(() => {
		return ConvertLiterals(returnedControls);
	}, [returnedControls]);

	return controls;
}

//This function gets all controls and converts them to a list of values, ready to be send as story props

export function ParametrizeControls(controls: ConvertedControls) {
	const controlValues: ParametrizedControls = {};

	for (const [name, control] of pairs(controls)) {
		if (control.EntryType === "ControlGroup") {
			controlValues[name] = ParametrizeControls(control.Controls) as Record<string, ControlValue>;
			continue;
		}
		controlValues[name] = control.ControlValue;
	}
	return controlValues;
}
