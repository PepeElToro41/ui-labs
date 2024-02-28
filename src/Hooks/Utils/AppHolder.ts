import { useSelector } from "@rbxts/react-reflex";
import { useCallback } from "@rbxts/roact";
import { selectHolder } from "Reflex/Interface";

//this hook gives you a function that converts AbsolutePosition to relative position
//based on the main frame that holds the entire plugin UI
//this is needed because in the story plugin where I visualize UI-labs the UI is usually not in the at the root frame
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
