import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { useProducer, useSelectorCreator } from "@rbxts/react-reflex";
import {
	ConvertedControls,
	ReturnControls
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { IntrinsicProps, StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";
import {
	useGetInputSignalsFromFrame,
	useInputSignals
} from "Context/UserInputContext";
import Configs from "Plugin/Configs";
import { selectPreview } from "Reflex/StoryPreview";
import Controls from "UI/StoryPreview/StoryActionRenders/Controls";
import Summary from "UI/StoryPreview/StoryActionRenders/Summary";
import { CreateTuple } from "Utils/MiscUtils";
import { MounterProps } from ".";
import { RecoverControlsData } from "..";
import {
	ConvertLiterals,
	CreateRecoverControlsData,
	ParametrizeControls
} from "./Utils";

export function useParametrizedControls(
	previewKey: string,
	controls: ConvertedControls,
	recoverControlsData: RecoverControlsData | undefined,
	setRecoverControlsData: (data?: RecoverControlsData) => void
) {
	const entry = useSelectorCreator(selectPreview, previewKey);
	const [values, setValues] = useState(
		ParametrizeControls(
			controls,
			entry
				? entry.RecoverControls
					? recoverControlsData
					: undefined
				: undefined
		)
	);

	useUpdateEffect(() => {
		if (entry === undefined) return;
		if (!entry.RecoverControls) {
			setRecoverControlsData(undefined);
			return;
		}

		const recoverData = CreateRecoverControlsData(controls, values);

		setRecoverControlsData(recoverData);
	}, [values]);

	return CreateTuple(values, setValues);
}
export function useControls(returnedControls: ReturnControls) {
	const controls = useMemo(() => {
		return ConvertLiterals(returnedControls);
	}, [returnedControls]);

	return controls;
}

export function useEnvironmentInjection(entryKey: string) {
	const entry = useSelectorCreator(selectPreview, entryKey);

	const injection = useMemo(() => {
		if (entry === undefined) return;
		const hotreloader = entry.HotReloader;
		if (!hotreloader) return;
		const environment = hotreloader.GetEnvironment();
		if (!environment) return;
		return environment.GetInjectedGlobal(Configs.GlobalInjectionKey);
	}, [entry]);
	return injection as Record<string, unknown>;
}

export function useStoryActionComponents(
	previewKey: string,
	result: StoryBase,
	returnControls: ReturnControls,
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
	setControlValues: React.Dispatch<React.SetStateAction<ParametrizedControls>>
) {
	const { setActionComponent } = useProducer<RootProducer>();

	useEffect(() => {
		if (previewKey === undefined) return;

		if (result.summary !== undefined && result.summary !== "") {
			setActionComponent(previewKey, "SummaryTab", {
				DisplayName: "Summary",
				Render: <Summary SummaryText={result.summary}></Summary>
			});
		}
		if (returnControls !== undefined) {
			setActionComponent(previewKey, "ControlsTab", {
				DisplayName: "Controls",
				Render: (
					<Controls
						Controls={controls}
						ControlValues={controlValues}
						SetControlValues={setControlValues}
						PreviewKey={previewKey}
					/>
				),
				Order: 2
			});
		}
	}, [previewKey, result, controlValues, returnControls, controls]);
}

type Props = Record<string, any>;

export function useStoryPassedProps(mounter: MounterProps<MountType>) {
	const inputs = useGetInputSignalsFromFrame(mounter.Entry.ListenerFrame);
	const inputSignals = useInputSignals(inputs);

	const GetStoryProps = useCallback(
		<T extends Props>(setProps: T) => {
			const intrinsic: IntrinsicProps = {
				inputListener: inputSignals,
				target: mounter.MountFrame
			};

			const props: IntrinsicProps & T = {
				...setProps,
				...intrinsic
			};
			return props;
		},
		[inputSignals]
	);
	return GetStoryProps;
}
