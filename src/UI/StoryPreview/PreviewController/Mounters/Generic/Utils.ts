import { GenericInfo, InferControlInfos } from "@rbxts/ui-labs/src/Typing/Generic";

export function CreateControlInfos(
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
	oldControlValues: ParametrizedControls,
) {
	const values = {} as Record<string, unknown>;

	for (const [name, control] of pairs(controls)) {
		const controlValue = controlValues[name];
		const oldControlValue = oldControlValues[name];

		if (control.EntryType === "ControlGroup") {
			values[name] = CreateControlInfos(control.Controls, controlValue as ParametrizedControls, oldControlValue);
			continue;
		}
		const value: GenericInfo<any> = {
			__new: controlValue,
			__old: oldControlValue,
		};
		values[name] = value;
	}
	return values as InferControlInfos<ConvertedControls>;
}
