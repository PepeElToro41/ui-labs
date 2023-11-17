import { useSelector } from "@rbxts/roact-reflex";
import { selectHolder } from "Reflex/Interface";

export function usePosition() {
	const holder = useSelector(selectHolder);

	return (mousePos: Vector2) => {
		if (!holder) return mousePos;

		const anchor = holder.AbsolutePosition;
		return mousePos.sub(anchor);
	};
}
