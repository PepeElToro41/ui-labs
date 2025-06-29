import { ControlGroup, ConvertControl, InferControlType } from "@rbxts/ui-labs";
import {
	ConvertedControlList,
	ConvertedControls,
	ObjectControl,
	ReturnControls
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { InferControlGroup } from "@rbxts/ui-labs/src/Typing/Typing";
import { WARNINGS } from "Plugin/Warnings";
import {
	AllRecovererMap,
	ControlRecoverer
} from "UI/StoryControls/ControlRecovers";
import { UILabsWarn } from "Utils/MiscUtils";
import {
	RecoverControlEntry,
	RecoverControlsData,
	RecoverGroupEntry
} from "..";

declare global {
	type ControlValue = InferControlType<ObjectControl>;
	type ParametrizedControls = Record<string, ControlValue | InferControlGroup>;
}

export function TryConvertControl(
	control: any
): ObjectControl | ControlGroup<ConvertedControlList> | undefined {
	const controlType = typeOf(control);
	if (controlType === "table") {
		return control;
	}

	const [succes, value] = pcall(ConvertControl, control);
	if (!succes) {
		warn(value);
		return undefined;
	}
	return value;
}

export function ConvertLiterals(controls: ReturnControls) {
	const converted: ConvertedControls = {};

	for (const [name, control] of pairs(controls)) {
		const finalControl = TryConvertControl(control);
		if (finalControl === undefined) continue;

		if (finalControl.EntryType === "ControlGroup") {
			converted[name] = {
				...finalControl,
				Controls: ConvertLiterals(finalControl.Controls) as ConvertedControlList
			};
			continue;
		}
		converted[name] = finalControl;
	}
	return converted;
}

export function CreateRecoverControlsData(
	controls: ConvertedControls,
	values: ParametrizedControls
) {
	const recoverData: RecoverControlsData = {};

	for (const [name, control] of pairs(controls)) {
		if (control.EntryType === "ControlGroup") {
			const groupData = CreateRecoverControlsData(
				control.Controls,
				values[name] as ParametrizedControls
			);
			recoverData[name] = {
				RecoverType: "ControlGroup",
				Controls: groupData as Record<string, RecoverControlEntry>
			};
			continue;
		}
		recoverData[name] = {
			RecoverType: "Control",
			Control: control,
			Value: values[name]
		};
	}
	return recoverData;
}

//This function gets all controls and converts them to a list of values, ready to be send as story props
export function ParametrizeControls(
	controls: ConvertedControls,
	defaults?: RecoverControlsData
) {
	const controlValues: ParametrizedControls = {};
	for (const [name, control] of pairs(controls)) {
		if (control.EntryType === "ControlGroup") {
			const recoverData = defaults
				? (defaults[name] as RecoverGroupEntry).Controls
				: undefined;
			controlValues[name] = ParametrizeControls(
				control.Controls,
				recoverData
			) as Record<string, ControlValue>;
			continue;
		}
		const recoverData = defaults && (defaults[name] as RecoverControlEntry);
		if (recoverData) {
			if (recoverData.Control.Type === control.Type) {
				const Recoverer = AllRecovererMap[
					control.Type
				] as ControlRecoverer<ObjectControl>;
				Recoverer(
					name,
					control,
					recoverData.Control,
					recoverData.Value,
					controlValues
				);
				continue;
			}
		}
		controlValues[name] = control.ControlValue;
	}
	return controlValues;
}

type ControlsReconciler = Record<string, any> | (() => Record<string, any>);

export function InjectStoryRuntime(
	injection: Record<string, unknown>,
	storyType: string,
	props: unknown
) {
	if (injection === undefined) return;
	const runtime = (injection["Runtime"] ?? {}) as Record<string, unknown>;

	runtime["Properties"] = props;
	runtime["StoryType"] = storyType;

	injection["Runtime"] = runtime;
	return runtime;
}

export function GetRuntimeReconciler(
	getControls: () => Record<string, any>, // gets the current controls (for the updater function)
	updateControls: (controls: Record<string, any>) => void, // updates the controls
	getFromValues?: () => Record<string, any> // way to get the controls from value objects (nil for react/roact)
) {
	const runtimeReconciler = (value?: ControlsReconciler) => {
		if (value === undefined) {
			if (getFromValues === undefined) {
				return UILabsWarn(WARNINGS.NoControlsReconciler, "nil");
			}
			const controls = getFromValues();
			return updateControls(controls);
		}

		if (typeIs(value, "function")) {
			const controls = value(getControls());
			if (typeIs(controls, "table")) {
				updateControls(controls);
			} else {
				return UILabsWarn(WARNINGS.NoReconcileResult, typeOf(value));
			}
		} else if (typeIs(value, "table")) {
			updateControls(value);
		} else {
			UILabsWarn(WARNINGS.NoControlsReconciler, typeOf(value));
		}
	};
	return runtimeReconciler;
}
