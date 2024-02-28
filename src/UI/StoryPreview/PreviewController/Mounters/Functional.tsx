import Roact, { useRef, useState } from "@rbxts/roact";
import { useEffect } from "@rbxts/roact";
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
				unmounter.current();
			}
		};
	}, []);
	return <></>;
}

export default Functional;
