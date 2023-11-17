import { useCallback } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";

export function useOverlayAction<T extends (...args: unknown[]) => unknown>(callback: T, deps: unknown[]): T {
	const { resetOverlay } = useProducer<RootProducer>();

	return useCallback((...args: Parameters<T>) => {
		resetOverlay();
		return callback(...args);
	}, deps) as T;
}
