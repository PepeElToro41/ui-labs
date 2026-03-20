import { useSelector } from "@rbxts/react-reflex";
import { selectTheme } from "Reflex/Theme";

export function useTheme() {
	return useSelector(selectTheme).theme;
}
