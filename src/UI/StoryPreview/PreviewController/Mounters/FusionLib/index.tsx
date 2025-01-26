import React, { useMemo } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { CreateFusion3Values, CreateFusionValues, GetFusionVersion, GetScopedFusion, UpdateFusionValues } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useStoryUnmount } from "../../Utils";
import { InferFusionProps } from "@rbxts/ui-labs";
import { Cast, FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { useStoryPassedProps } from "../Utils";
import { useControls, useParametrizedControls, useStoryActionComponents } from "../Hooks";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";

const FUSION_ERR = WARNING_STORY_TYPES.Fusion;

function FusionLib(props: MounterProps<"FusionLib">) {
	const result = props.Result;
	const version = GetFusionVersion(result.fusion);
	const fusion = version === "Fusion2" ? result.fusion : GetScopedFusion(Cast<Fusion3>(result.fusion), result.scoped ?? []);

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData,
	);
	const GetProps = useStoryPassedProps();

	const fusionValues = useMemo(() => {
		if (version === "Fusion2") {
			return CreateFusionValues(fusion, controls, controlValues);
		} else {
			return CreateFusion3Values(Cast<Fusion3>(fusion), controls, controlValues);
		}
	}, []);

	useUpdateEffect(() => {
		UpdateFusionValues(fusionValues, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		if (props.Result.scoped !== undefined) {
			if (version === "Fusion2") {
				warn("UI Labs: scoped key provided for Fusion 0.2, this will be ignored");
			}
		}

		const fusionProps: InferFusionProps<ConvertedControls> = GetProps({
			controls: fusionValues,
			target: props.MountFrame,
			scope: Cast<Fusion3>(fusion),
		});

		const value = YCall(result.story, fusionProps, (didYield, err) => {
			if (didYield) {
				UILabsWarn(WARNINGS.Yielding.format(FUSION_ERR));
			} else {
				UILabsWarn(WARNINGS.StoryError.format(FUSION_ERR), err);
			}
		});
		return value ? (typeIs(value, "Instance") ? () => value.Destroy() : value) : undefined;
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (cleanup) {
			FastSpawn(() => {
				const [success, err] = pcall(cleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		} else {
			if (version === "Fusion2") {
				warn("UI Labs: No cleanup function was returned for Fusion 0.2, there's no way to cleanup the story.");
			}
		}
		if (version === "Fusion3") {
			Cast<Fusion3>(fusion).doCleanup(fusion);
		}
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default FusionLib;
