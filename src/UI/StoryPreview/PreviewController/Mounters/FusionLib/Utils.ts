import Fusion from "@rbxts/fusion";
import {
	CreateControlStates,
	InferFusionControls,
	UpdateControlStates
} from "@rbxts/ui-labs";
import { ConvertedControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { Cast } from "Utils/MiscUtils";

export function GetScopedFusion(fusion: Fusion3, scoped: object[]) {
	return Cast<Fusion>(fusion.scoped(fusion, ...scoped));
}

export function GetFusionVersion(fusion: typeof Fusion) {
	if (fusion.version.minor === 2) {
		return "Fusion2";
	} else {
		return "Fusion3";
	}
}

export function CreateFusionValues(
	fusion: typeof Fusion,
	controls: ConvertedControls,
	controlValues: ParametrizedControls
) {
	return CreateControlStates(controls, controlValues, (value) => {
		return fusion.Value(value);
	}) as InferFusionControls<ConvertedControls>;
}

export function CreateFusion3Values(
	fusion: Fusion3,
	controls: ConvertedControls,
	controlValues: ParametrizedControls
) {
	return CreateControlStates(controls, controlValues, (value) => {
		return fusion.Value(value);
	}) as InferFusionControls<ConvertedControls>;
}

export function UpdateFusionValues(
	values: InferFusionControls<ConvertedControls>,
	controls: ConvertedControls,
	controlValues: ParametrizedControls
) {
	UpdateControlStates(
		values,
		controls,
		controlValues,
		(value: Fusion.Value<any>, update) => {
			return value.set(update);
		}
	);
}
