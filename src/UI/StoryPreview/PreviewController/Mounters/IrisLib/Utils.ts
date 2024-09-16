import Iris from "@rbxts/iris";
import { UserInputService } from "@rbxts/services";
import { CreateControlStates, InferIrisControls, UpdateControlStates } from "@rbxts/ui-labs";
import { ConvertedControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useInputSignals } from "Context/UserInputContext";

export function CreateIrisStates(iris: typeof Iris, controls: ConvertedControls, controlValues: ParametrizedControls) {
	return CreateControlStates(controls, controlValues, (value) => {
		return iris.State(value);
	}) as InferIrisControls<ConvertedControls>;
}

export function UpdateIrisStates(
	values: InferIrisControls<ConvertedControls>,
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
) {
	UpdateControlStates(values, controls, controlValues, (value: Iris.State<any>, update) => {
		return value.set(update);
	});
}

export function CreateUserInputMock(mountFrame: Frame): UserInputService {
	const inputSignals = useInputSignals();

	return UserInputService;
}

export function SetupIris(iris: typeof Iris, mountFrame: Frame, uisMock: UserInputService) {}
