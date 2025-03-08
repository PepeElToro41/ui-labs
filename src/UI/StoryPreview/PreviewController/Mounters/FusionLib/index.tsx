import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { InferFusionProps } from "@rbxts/ui-labs";
import {
	ConvertedControls,
	ReturnControls
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { Cast, FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import {
	useControls,
	useParametrizedControls,
	useStoryActionComponents,
	useStoryPassedProps
} from "../Hooks";
import {
	CreateFusion3Values,
	CreateFusionValues,
	GetFusionVersion,
	GetScopedFusion,
	UpdateFusionValues
} from "./Utils";

const FUSION_ERR = WARNING_STORY_TYPES.Fusion;

function FusionLib(props: MounterProps<"FusionLib">) {
	const result = props.Result;
	const version = GetFusionVersion(result.fusion);
	const fusion =
		version === "Fusion2"
			? result.fusion
			: GetScopedFusion(Cast<Fusion3>(result.fusion), result.scoped ?? []);

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData
	);
	const GetProps = useStoryPassedProps(props);

	const fusionValues = useMemo(() => {
		if (version === "Fusion2") {
			return CreateFusionValues(fusion, controls, controlValues);
		} else {
			return CreateFusion3Values(
				Cast<Fusion3>(fusion),
				controls,
				controlValues
			);
		}
	}, []);

	useUpdateEffect(() => {
		UpdateFusionValues(fusionValues, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		if (props.Result.scoped !== undefined) {
			if (version === "Fusion2") {
				warn(
					"UI Labs: scoped key provided for Fusion 0.2, this will be ignored"
				);
			}
		}

		const fusionProps: InferFusionProps<ConvertedControls> = GetProps({
			controls: fusionValues,
			scope: Cast<Fusion3>(fusion)
		});

		const value = YCall(result.story, fusionProps, (didYield, err) => {
			if (didYield) {
				UILabsWarn(WARNINGS.Yielding.format(FUSION_ERR));
			} else {
				UILabsWarn(WARNINGS.StoryError.format(FUSION_ERR), err);
			}
		});
		if (value) {
			if (typeIs(value, "function")) {
				return value;
			} else {
				if (version === "Fusion3") {
					const scope = Cast<Fusion3>(fusion);
					scope.Hydrate(props.MountFrame)({
						[fusion.Children]: value
					});
				} else {
					fusion.Hydrate(props.MountFrame)({
						[fusion.Children]: value
					});
				}
			}
		} else {
			return undefined;
		}
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (cleanup) {
			FastSpawn(() => {
				const [success, err] = pcall(cleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		}
		if (version === "Fusion3") {
			Cast<Fusion3>(fusion).doCleanup(fusion);
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

	return <></>;
}

export default FusionLib;
