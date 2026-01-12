import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { InferVideControls, InferVideProps } from "@rbxts/ui-labs";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";

import { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Hooks";
import { CreateVideScopes, UpdateVideScopes } from "./Utils";

const VIDE_ERR = WARNING_STORY_TYPES.Vide;

function VideLib(props: MounterProps<"VideLib">) {
	const result = props.Result;
	const vide = result.vide;

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData
	);
	const GetProps = useStoryPassedProps(props);

	const [sources, sourcesCleanup] = useMemo(() => {
		let gotSources: InferVideControls<ConvertedControls> = {};
		const cleanup = vide.mount(() => {
			gotSources = CreateVideScopes(vide, controls, controlValues);
		});
		return [gotSources, cleanup];
	}, []);

	useUpdateEffect(() => {
		UpdateVideScopes(sources, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		const videProps: InferVideProps<ConvertedControls> = GetProps({
			controls: sources
		});
		const unmount = vide.mount(() => {
			return YCall(result.story, videProps, (didYield, err) => {
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(VIDE_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(VIDE_ERR), err);
				}
			});
		}, props.MountFrame);
		return unmount;
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		vide.step(0); // disconnect spring connection;
		FastSpawn(() => {
			const [success, err] = pcall(cleanup);
			if (!success) {
				UILabsWarn(WARNINGS.CleanupError, err);
			}
		});
		sourcesCleanup();
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default VideLib;
