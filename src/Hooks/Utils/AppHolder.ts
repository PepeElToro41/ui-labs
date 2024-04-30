import { useSelector } from "@rbxts/react-reflex";
import { useCallback } from "@rbxts/react";
import { selectHolder } from "Reflex/Interface";

/*
   this hook gives you a function that converts AbsolutePosition to relative position
   based on the main frame that holds the entire plugin UI
   this is needed because when I visualize the plugin in a story the main frame is not at [0, 0]
*/
export function usePosition() {
	const holder = useSelector(selectHolder);

	const PositionSet = useCallback(
		(mousePos: Vector2) => {
			if (!holder) return mousePos;

			const anchor = holder.AbsolutePosition;
			return mousePos.sub(anchor);
		},
		[holder],
	);
	return PositionSet;
}

export function useAppHolder() {
	const holder = useSelector(selectHolder);

	return holder;
}
