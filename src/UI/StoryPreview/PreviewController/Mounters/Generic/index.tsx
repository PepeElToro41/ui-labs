import React, { useCallback, useMemo, useRef, useState } from "@rbxts/react";
import { MounterProps } from "..";
import { ParametrizeControls, useControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
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
				listener(controlValues as InferControls<ReturnControls>, controlInfos);
			}
		},
		[controlValues],
	);

	const cleanup = useMemo(() => {
		const storyProps: InferGenericProps<ConvertedControls> = GetProps({
			controls: controlValues as InferControls<ConvertedControls>,
			target: props.MountFrame,
			subscribe: AddListener,
		});
		return result.render(storyProps);
	}, []);

	useUpdateEffect(() => {
		RunListeners(oldControlValues);
		setOldControlValues(controlValues);
	}, [controlValues]);

	useStoryUnmount(result, () => {
		listeners.current = [];
		cleanup();
	});

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default Generic;
