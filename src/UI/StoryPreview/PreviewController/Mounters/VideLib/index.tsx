import React, { useMemo, useState } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { ParametrizeControls, useControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { CreateVideScopes, UpdateVideScopes } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferVideProps } from "@rbxts/ui-labs";
import { useStoryUnmount } from "../../Utils";

function VideLib(props: MounterProps<"VideLib">) {
	const result = props.Result;
	const vide = result.vide;

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
	const GetProps = useStoryPassedProps();

	const [sources, sourcesCleanup] = useMemo(() => {
		return vide.root((cleanup) => {
			const returnSources = CreateVideScopes(vide, controls, controlValues);
			return [returnSources, cleanup];
		});
	}, []);

	useUpdateEffect(() => {
		UpdateVideScopes(sources, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		const videProps: InferVideProps<ConvertedControls> = GetProps({
			target: props.MountFrame,
			controls: sources,
		});
		const unmount = vide.mount(() => {
			const [success, value] = pcall(() => result.story(videProps));
			if (!success) {
				return warn("UI Labs: Vide story errored when mounting. The story won't cleanup: ", value);
			}
			return value;
		}, props.MountFrame);
		return unmount;
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		const [success, err] = pcall(cleanup);
		if (!success) {
			warn("UI Labs: Vide errored when unmounting, this may cause a memory leak: ", err);
		}
		sourcesCleanup();
	});

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <></>;
}

export default VideLib;
