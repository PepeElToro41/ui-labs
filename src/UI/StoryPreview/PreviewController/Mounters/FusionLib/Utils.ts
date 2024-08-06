import Fusion from "@rbxts/fusion";
import { InferFusionControls } from "@rbxts/ui-labs";
import { Cast } from "Utils/MiscUtils";

export function GetScopedFusion(fusion: Fusion3) {
	return Cast<Fusion>(fusion.scoped(fusion));
}

export function GetFusionVersion(fusion: typeof Fusion) {
	if (fusion.version.minor === 2) {
		return "Fusion2";
	} else {
		return "Fusion3";
	}
}

export function CreateFusionValues(fusion: typeof Fusion, controls: ConvertedControls, controlValues: ParametrizedControls) {
	const values = {} as Record<string, unknown>;

	for (const [name, control] of pairs(controls)) {
		const controlValue = controlValues[name];

		if (control.EntryType === "ControlGroup") {
			values[name] = CreateFusionValues(fusion, control.Controls, controlValue as ParametrizedControls);
			continue;
		}
		values[name] = fusion.Value(controlValue);
	}
	return values as InferFusionControls<ConvertedControls>;
}

export function CreateFusion3Values(fusion: Fusion3, controls: ConvertedControls, controlValues: ParametrizedControls) {
	const values = {} as Record<string, unknown>;

	for (const [name, control] of pairs(controls)) {
		const controlValue = controlValues[name];

		if (control.EntryType === "ControlGroup") {
			values[name] = CreateFusion3Values(fusion, control.Controls, controlValue as ParametrizedControls);
			continue;
		}
		values[name] = fusion.Value(controlValue);
	}
	return values as InferFusionControls<ConvertedControls>;
}

export function UpdateFusionValues(
	values: InferFusionControls<ConvertedControls>,
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
) {
	for (const [name, control] of pairs(controls)) {
		const controlValue = controlValues[name];

		if (control.EntryType === "ControlGroup") {
			UpdateFusionValues(values[name], control.Controls, controlValue as ParametrizedControls);
			continue;
		}
		const value = values[name] as Fusion.Value<unknown>;
		value.set(controlValue);
	}
}
