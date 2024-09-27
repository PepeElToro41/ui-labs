import React, { useMemo } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Hooks";
import { CreateIrisStates, useUserInputServiceMock, SetupIris, UpdateIrisStates } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferIrisProps } from "@rbxts/ui-labs";
import { useStoryUnmount } from "../../Utils";

function IrisLib(props: MounterProps<"IrisLib">) {
	const result = props.Result;
	const uisMock = useUserInputServiceMock();

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData,
	);
	const GetProps = useStoryPassedProps();

	const [irisStates, cleanup] = useMemo(() => {
		const setupCleanup = SetupIris(result.iris, props.MountFrame, uisMock);
		result.iris.Init(props.MountFrame);

		const states = CreateIrisStates(result.iris, controls, controlValues);
		const irisProps: InferIrisProps<ConvertedControls> = GetProps({
			controls: irisStates,
			target: props.MountFrame,
		});

		const [success, value] = pcall(() => result.story(irisProps));

		if (!success) {
			warn("UI Labs: Iris story errored when mounting. The cleanup function will not be executed: ", value);
			const defCleanup = () => {
				setupCleanup();
				warn("UI Labs: The cleanup function was not found. This might be due to the story erroring. This may cause a memory leak.");
			};
			return [states, defCleanup];
		}
		const returnCleanup = () => {
			if (value) {
				pcall(value);
			}
			setupCleanup();
		};
		return [states, returnCleanup];
	}, []);

	useUpdateEffect(() => {
		UpdateIrisStates(irisStates, controls, controlValues);
	}, [controlValues]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		const [success, value] = pcall(cleanup);
		if (!success) {
			warn("UI Labs: Iris story errored when unmounting. This may cause a memory leak: ", value);
		}

		print("SHUTDOWN IRIS");
		props.Result.iris.Shutdown();
		uisMock.Destroy();
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default IrisLib;
