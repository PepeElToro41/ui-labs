import React, { useMemo } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Hooks";
import { CreateIrisStates, useUserInputServiceMock, SetupIris, UpdateIrisStates } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferIrisProps } from "@rbxts/ui-labs";
import { useStoryUnmount } from "../../Utils";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";

const IRIS_ERR = WARNING_STORY_TYPES.Iris;

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

	const [irisStates, SetupCleanup, StoryCleanup] = useMemo(() => {
		const setupCleanup = SetupIris(result.iris, props.MountFrame, uisMock);
		result.iris.Init(props.MountFrame);

		const states = CreateIrisStates(result.iris, controls, controlValues);
		const irisProps: InferIrisProps<ConvertedControls> = GetProps({
			controls: states,
			target: props.MountFrame,
		});

		const cleanup = YCall(result.story, irisProps, (didYield, err) => {
			if (didYield) {
				UILabsWarn(WARNINGS.Yielding.format(IRIS_ERR));
			} else {
				UILabsWarn(WARNINGS.StoryError.format(IRIS_ERR), err);
			}
		});
		return [states, setupCleanup, cleanup];
	}, []);

	useUpdateEffect(() => {
		UpdateIrisStates(irisStates, controls, controlValues);
	}, [controlValues]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (StoryCleanup) {
			FastSpawn(() => {
				const [success, err] = pcall(StoryCleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		}
		SetupCleanup();

		props.Result.iris.Shutdown();
		uisMock.Destroy();
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default IrisLib;
