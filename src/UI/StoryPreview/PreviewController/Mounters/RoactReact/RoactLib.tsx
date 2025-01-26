import React, { useCallback, useMemo } from "@rbxts/react";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Hooks";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import type { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import { InferControls } from "@rbxts/ui-labs";
import { UILabsWarn, YCall } from "Utils/MiscUtils";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";

const ROACT_ERR = WARNING_STORY_TYPES.Roact;

function RoactLib(props: MounterProps<"RoactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;

	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData,
	);
	const GetProps = useStoryPassedProps();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			const props = GetProps({ controls: controlValues as InferControls<ReturnControls> });

			return YCall(result.story, props, (didYield, err) => {
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(ROACT_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(ROACT_ERR), err);
				}
			});
		} else {
			return result.story;
		}
	}, [controlValues, props.Result]);

	const handle = useMemo(() => {
		const component = RenderComponent();

		if (component) {
			return result.roact.mount(component, props.MountFrame);
		}
	}, []);

	useUpdateEffect(() => {
		const component = RenderComponent();
		if (component && handle) {
			result.roact.update(handle, component);
		}
	}, [controlValues, result]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (handle) {
			result.roact.unmount(handle);
		}
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default RoactLib;
