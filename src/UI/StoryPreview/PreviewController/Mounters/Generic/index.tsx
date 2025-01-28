import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useMemo, useRef, useState } from "@rbxts/react";
import { InferControls } from "@rbxts/ui-labs";
import {
	ConvertedControls,
	ReturnControls
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import {
	InferGenericProps,
	SubscribeListener
} from "@rbxts/ui-labs/src/Typing/Generic";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import {
	useControls,
	useParametrizedControls,
	useStoryActionComponents,
	useStoryPassedProps
} from "../Hooks";
import { CreateControlInfos } from "./Utils";

const GENERIC_ERR = WARNING_STORY_TYPES.Generic;

function Generic(props: MounterProps<"Generic">) {
	const result = props.Result;

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData
	);
	const [oldControlValues, setOldControlValues] =
		useState<ParametrizedControls>(controlValues);
	const listeners = useRef<SubscribeListener<ReturnControls>[]>([]);
	const GetProps = useStoryPassedProps(props);

	const RemoveListener = useCallback(
		(listener: SubscribeListener<ReturnControls>) => {
			const oldListeners = listeners.current;
			listeners.current = oldListeners.filter(
				(oldListener) => oldListener !== listener
			);
		},
		[]
	);
	const AddListener = useCallback(
		(listener: SubscribeListener<ReturnControls>) => {
			const oldListeners = listeners.current;
			if (oldListeners.includes(listener)) {
				return () => RemoveListener(listener);
			}
			listeners.current = [...oldListeners, listener];

			return () => RemoveListener(listener);
		},
		[]
	);

	const RunListeners = useCallback(
		(oldValues: ParametrizedControls) => {
			const controlInfos = CreateControlInfos(
				controls,
				controlValues,
				oldValues
			);
			for (const listener of listeners.current) {
				const caller = () =>
					listener(
						controlValues as InferControls<ReturnControls>,
						controlInfos
					);

				YCall(caller, undefined, (didYield, err) => {
					if (didYield) {
						UILabsWarn(WARNINGS.Yielding.format("Control Listener"));
					} else {
						UILabsWarn(WARNINGS.StoryError.format("Control Listener"), err);
					}
				});
			}
		},
		[controlValues]
	);

	const cleanup = useMemo(() => {
		const storyProps: InferGenericProps<ConvertedControls> = GetProps({
			controls: controlValues as InferControls<ConvertedControls>,
			converted: controls,
			subscribe: AddListener
		});
		const value = YCall(result.render, storyProps, (didYield, err) => {
			if (didYield) {
				UILabsWarn(WARNINGS.Yielding.format(GENERIC_ERR));
			} else {
				UILabsWarn(WARNINGS.StoryError.format(GENERIC_ERR), err);
			}
		});
		return value;
	}, []);

	useUpdateEffect(() => {
		RunListeners(oldControlValues);
		setOldControlValues(controlValues);
	}, [controlValues]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		listeners.current = [];
		if (cleanup) {
			FastSpawn(() => {
				const [success, err] = pcall(cleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		} else {
			UILabsWarn(WARNINGS.NoCleanup);
		}
	});

	useStoryActionComponents(
		props.Entry.Key,
		props.Result,
		returnControls,
		controls,
		controlValues,
		setControlValues
	);

	return <React.Fragment></React.Fragment>;
}

export default Generic;
