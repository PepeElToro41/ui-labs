import { useSelector } from "@rbxts/react-reflex";
import { selectOverlay } from "Reflex/Overlay";

export function useIsOverlayBlocked() {
	const overlay = useSelector(selectOverlay);
	const isBlocked = overlay !== undefined;
	return isBlocked;
}
