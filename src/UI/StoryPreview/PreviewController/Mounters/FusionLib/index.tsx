import React, { useMemo } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { CreateFusion3Values, CreateFusionValues, GetFusionVersion, GetScopedFusion, UpdateFusionValues } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useStoryUnmount } from "../../Utils";
import { InferFusionProps } from "@rbxts/ui-labs";
import { Cast } from "Utils/MiscUtils";
import { useStoryPassedProps } from "../Utils";
import { useControls, useParametrizedControls, useStoryActionComponents } from "../Hooks";

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

		const [success, value] = pcall(() => result.story(fusionProps));
		if (!success) {
			warn("UI Labs: Fusion story errored when mounting. The cleanup function will not be executed: ", value);
			return () => {
				warn("UI Labs: The cleanup function was not found. This might be due to the story erroring. This may cause a memory leak.");
			};
		}
		return value ? (typeIs(value, "Instance") ? () => value.Destroy() : value) : undefined;
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (cleanup) {
			const [success, err] = pcall(cleanup);
			if (!success) {
				warn("UI Labs: The cleanup function errored when unmounting. This may cause a memory leak: ", err);
			}
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
