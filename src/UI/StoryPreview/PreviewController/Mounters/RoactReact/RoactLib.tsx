import React, { useCallback, useMemo } from "@rbxts/react";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import type { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import { InferControls } from "@rbxts/ui-labs";

function RoactLib(props: MounterProps<"RoactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;

	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(controls, props.RecoverControlsData, props.SetRecoverControlsData);
	const GetProps = useStoryPassedProps();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			return result.story(GetProps({ controls: controlValues as InferControls<ReturnControls> }));
		} else {
			return result.story;
		}
	}, [controlValues, props.Result]);

	const handle = useMemo(() => {
		return result.roact.mount(RenderComponent(), props.MountFrame);
	}, []);

	useUpdateEffect(() => {
		const component = RenderComponent();
		result.roact.update(handle, component);
	}, [controlValues, result]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		result.roact.unmount(handle);
	});

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default RoactLib;
