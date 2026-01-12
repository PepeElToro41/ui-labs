import { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";

//useOverlayAction runs your callback, and closes the current overlay (itself) when running it
export function useOverlayAction<T extends (...args: any[]) => any>(callback: T, deps: any[]): T {
	const { resetPopup } = useProducer<RootProducer>();

	return useCallback((...args: Parameters<T>) => {
		resetPopup();
		return callback(...(args as unknown[]));
	}, deps) as T;
}
