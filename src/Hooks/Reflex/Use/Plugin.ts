import { useSelector } from "@rbxts/roact-reflex";
import { selectPlugin } from "Reflex/Plugin";

export function usePlugin() {
	const plugin = useSelector(selectPlugin);
	return plugin;
}
