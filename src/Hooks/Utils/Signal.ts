import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useMemo } from "@rbxts/react";
import Signal from "@rbxts/signal";

export function useSignal<Signature extends Callback>() {
	const newSignal = useMemo(() => {
		const returnSignal = new Signal<Signature>();
		return returnSignal;
	}, []);
	useUnmountEffect(() => {
		newSignal.Destroy();
	});

	return newSignal;
}
