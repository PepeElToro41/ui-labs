import React, { useCallback, useMemo, useRef, useState } from "@rbxts/react";
import { MounterProps } from "..";
import { ParametrizeControls, useControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { InferGenericProps, SubscribeListener } from "@rbxts/ui-labs/src/Typing/Generic";
import { InferControls } from "@rbxts/ui-labs";
import { CreateControlInfos } from "./Utils";
import { useStoryUnmount } from "../../Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";

function Generic(props: MounterProps<"Generic">) {
	const result = props.Result;

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
	const [oldControlValues, setOldControlValues] = useState<ParametrizedControls>(controlValues);
	const listeners = useRef<SubscribeListener<ReturnControls>[]>([]);
	const GetProps = useStoryPassedProps();

	const RemoveListener = useCallback((listener: SubscribeListener<ReturnControls>) => {
		const oldListeners = listeners.current;
		listeners.current = oldListeners.filter((oldListener) => oldListener !== listener);
	}, []);
	const AddListener = useCallback((listener: SubscribeListener<ReturnControls>) => {
		const oldListeners = listeners.current;
		if (oldListeners.includes(listener)) {
			return () => RemoveListener(listener);
		}
		listeners.current = [...oldListeners, listener];

		return () => RemoveListener(listener);
	}, []);

	const RunListeners = useCallback(
		(oldValues: ParametrizedControls) => {
			const controlInfos = CreateControlInfos(controls, controlValues, oldValues);
			for (const listener of listeners.current) {
				const [success, err] = pcall(() => listener(controlValues as InferControls<ReturnControls>, controlInfos));
				if (!success) {
					warn("UI Labs: Generic Story listener errored when updating.", err);
				}
			}
		},
		[controlValues],
	);

	const cleanup = useMemo(() => {
		const storyProps: InferGenericProps<ConvertedControls> = GetProps({
			controls: controlValues as InferControls<ConvertedControls>,
			converted: controls,
			target: props.MountFrame,
			subscribe: AddListener,
		});
		const [success, err] = pcall(() => result.render(storyProps));
		if (!success) {
			warn("UI Labs: Generic story errored when mounting. The cleanup function will not be executed: ", err);
			return () => {
				warn("UI Labs: The cleanup function was not found. This might be due to the story erroring. This may cause a memory leak.");
			};
		}
		return err;
	}, []);

	useUpdateEffect(() => {
		RunListeners(oldControlValues);
		setOldControlValues(controlValues);
	}, [controlValues]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		listeners.current = [];
		const [success, err] = pcall(cleanup);
		if (!success) {
			warn("UI Labs: The cleanup function errored when unmounting. This may cause a memory leak: ", err);
		}
	});

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default Generic;
