import { useSelector } from "@rbxts/roact-reflex";
import { selectTheme } from "Reflex/Theme";

export function useTheme() {
	return useSelector(selectTheme).theme;
}
