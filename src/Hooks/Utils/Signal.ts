import { useUnmountEffect } from "@rbxts/pretty-roact-hooks";
import { useMemo } from "@rbxts/roact-hooked";
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
