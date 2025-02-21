import React, { useEffect, useRef } from "@rbxts/react";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { MounterProps } from ".";

const FUNCTIONAL_ERR = WARNING_STORY_TYPES.Functional;

function Functional(props: MounterProps<"Functional">) {
	const unmounter = useRef<() => void>();

	useEffect(() => {
		unmounter.current = YCall(
			props.Result,
			props.MountFrame,
			(didYield, err) => {
				print("ERR", err);
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(FUNCTIONAL_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(FUNCTIONAL_ERR), err);
				}
			}
		);
	}, []);

	props.UnmountSignal.Connect(() => {
		if (unmounter.current) {
			const cleanup = unmounter.current;
			FastSpawn(() => {
				const [success, err] = pcall(cleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		} else {
			UILabsWarn(WARNINGS.NoCleanup);
		}
	});

	return <React.Fragment></React.Fragment>;
}

export default Functional;
