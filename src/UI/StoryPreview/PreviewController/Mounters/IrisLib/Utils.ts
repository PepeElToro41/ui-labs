import type Iris from "@rbxts/iris";
import { useEffect, useMemo } from "@rbxts/react";
import { CreateControlStates, InferIrisControls, UpdateControlStates } from "@rbxts/ui-labs";
import { ConvertedControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useInputSignals } from "Context/UserInputContext";
import UserInputMock from "./UserInputMock";
import { useMousePos } from "Hooks/Context/UserInput";

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

export function useUserInputServiceMock(): UserInputService {
	const inputSignals = useInputSignals();
	const mouse = useMousePos();

	const userInputMock = useMemo(() => {
		const mock = new UserInputMock(inputSignals, mouse);
		mock.Init();
		return mock;
	}, [mouse, inputSignals]);

	useEffect(() => {
		const mock = userInputMock;

		return () => {
			mock.Destroy();
		};
	}, [userInputMock]);

	return userInputMock as never;
}

export function SetupIris(iris: typeof Iris, mountFrame: Frame, uisMock: UserInputService) {
	iris.Internal._utility.UserInputService = uisMock;
	iris.UpdateGlobalConfig({
		UseScreenGUIs: false,
	});
	(iris.Internal._utility as Record<string, any>)["GuiOffset"] = mountFrame.AbsolutePosition;
	iris.Internal._utility.MouseOffset = mountFrame.AbsolutePosition;

	const connection = mountFrame.GetPropertyChangedSignal("AbsolutePosition").Connect(() => {
		(iris.Internal._utility as Record<string, any>)["GuiOffset"] = mountFrame.AbsolutePosition;
		iris.Internal._utility.MouseOffset = mountFrame.AbsolutePosition;
	});

	return () => connection.Disconnect();
}
