import { useSelector } from "@rbxts/react-reflex";
import { selectPlugin } from "Reflex/Plugin";

export function usePlugin() {
	const plugin = useSelector(selectPlugin);
	return plugin;
}
