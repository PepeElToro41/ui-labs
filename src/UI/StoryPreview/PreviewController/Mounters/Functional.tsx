import React, { useRef } from "@rbxts/react";
import { useEffect } from "@rbxts/react";
import { MounterProps } from ".";

function Functional(props: MounterProps<"Functional">) {
	const unmounter = useRef<() => void>();

	useEffect(() => {
		Promise.try(() => props.Result(props.MountFrame))
			.then((cleanup) => {
				unmounter.current = cleanup;
			})
			.catch((err) => warn("UI Labs: Function story errored when mounting. The cleanup function will not be executed: ", err));
		return () => {
			if (unmounter.current) {
				const [success, err] = pcall(unmounter.current);
				if (!success) {
					warn("UI Labs: The cleanup function errored when unmounting. This may cause a memory leak: ", err);
				}
			} else {
				warn("UI Labs: The cleanup function was not found. This might be due to the story erroring. This may cause a memory leak.");
			}
		};
	}, []);
	return <React.Fragment></React.Fragment>;
}

export default Functional;
