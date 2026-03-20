import { Signal } from "@rbxts/lemon-signal";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useMemo } from "@rbxts/react";

export function useSignal<Signature extends Array<defined>>() {
	const newSignal = useMemo(() => {
		const returnSignal = new Signal<Signature>();
		return returnSignal;
	}, []);
	useUnmountEffect(() => {
		newSignal.Destroy();
	});

	return newSignal;
}
