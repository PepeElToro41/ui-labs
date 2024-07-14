import React, { useRef, useState } from "@rbxts/react";
import { useEffect } from "@rbxts/react";
import { FunctionStory } from "@rbxts/ui-labs";
import { MounterProps } from ".";

function Functional(props: MounterProps<"Functional">) {
	const unmounter = useRef<() => void>();

	useEffect(() => {
		Promise.try(() => props.Result(props.MountFrame))
			.then((cleanup) => {
				unmounter.current = cleanup;
			})
			.catch((err) => warn("UI-Labs: Function story errored when mounting: ", err));
		return () => {
			if (unmounter.current) {
				const [success, err] = pcall(unmounter.current);
				if (!success) {
					warn("UI-Labs: Error while running the functional cleaner: ", err);
				}
			}
		};
	}, []);
	return <React.Fragment></React.Fragment>;
}

export default Functional;
