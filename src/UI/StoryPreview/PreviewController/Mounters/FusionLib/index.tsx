import React, { useMemo, useState } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { ParametrizeControls, useControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { CreateFusion3Values, CreateFusionValues, GetFusionVersion, GetScopedFusion, UpdateFusionValues } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useStoryUnmount } from "../../Utils";
import { InferFusionProps } from "@rbxts/ui-labs";
import { Cast } from "Utils/MiscUtils";

function FusionLib(props: MounterProps<"FusionLib">) {
	const result = props.Result;
	const version = GetFusionVersion(result.fusion);
	const fusion = version === "Fusion2" ? result.fusion : GetScopedFusion(Cast<Fusion3>(result.fusion));

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
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
		const fusionProps: InferFusionProps<ConvertedControls> = GetProps({
			controls: fusionValues,
			target: props.MountFrame,
		});

		const value = result.story(fusionProps);
		return typeIs(value, "Instance") ? () => value.Destroy() : value;
	}, []);

	useStoryUnmount(result, () => {
		cleanup();
		if (version === "Fusion3") {
			Cast<Fusion3>(fusion).doCleanup(fusion);
		}
	});

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default FusionLib;
