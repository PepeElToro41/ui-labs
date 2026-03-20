import { useSelector } from "@rbxts/react-reflex";
import { selectPopup } from "Reflex/Overlay";

export function useIsOverlayBlocked() {
	const overlay = useSelector(selectPopup);
	const isBlocked = overlay !== undefined;
	return isBlocked;
}
