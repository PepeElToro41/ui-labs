import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import Summary from "UI/StoryPreview/StoryActionRenders/Summary";
import { ParametrizeControls, useControls } from "./Utils";
import { useUnmountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferControls } from "@rbxts/ui-labs/src/Typing";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import Controls from "UI/StoryPreview/StoryActionRenders/Controls";
import type { MounterProps } from "..";
import { useInputSignals } from "Context/UserInputContext";

function RoactLib(props: MounterProps<"RoactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;

	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));

	const signals = useInputSignals();
	const { setActionComponent } = useProducer<RootProducer>();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			return result.story({ controls: controlValues as InferControls<ReturnControls>, inputListener: signals });
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

	useEffect(() => {
		if (props.Result.summary !== undefined) {
			setActionComponent(props.Entry.Key, "SummaryTab", {
				DisplayName: "Summary",
				Render: <Summary SummaryText={props.Result.summary}></Summary>,
			});
		}
		if (returnControls !== undefined) {
			setActionComponent(props.Entry.Key, "ControlsTab", {
				DisplayName: "Controls",
				Render: <Controls Controls={controls} ControlValues={controlValues} SetControlValues={setControlValues} />,
				Order: 2,
			});
		}
	}, [result, controlValues]);

	useUnmountEffect(() => {
		result.roact.unmount(handle);
		if (result.cleanup) {
			result.cleanup();
		}
	});

	return <React.Fragment></React.Fragment>;
}

export default RoactLib;
