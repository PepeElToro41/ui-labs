import { CreateControlStates, InferVideControls, UpdateControlStates } from "@rbxts/ui-labs";
import { ConvertedControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import Vide from "@rbxts/vide";

export function CreateVideScopes(vide: typeof Vide, controls: ConvertedControls, controlValues: ParametrizedControls) {
	return CreateControlStates(controls, controlValues, (value) => {
		return vide.source(value);
	}) as InferVideControls<ConvertedControls>;
}

export function UpdateVideScopes(
	sources: InferVideControls<ConvertedControls>,
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
) {
	UpdateControlStates(sources, controls, controlValues, (source: Vide.Source<any>, update) => {
		return source(update);
	});
}
