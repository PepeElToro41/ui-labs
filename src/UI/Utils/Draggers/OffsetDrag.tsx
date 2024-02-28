import Roact, { useCallback } from "@rbxts/roact";
import DragBase, { DragBaseProps, SlideReturn } from "./DragBase";

interface OffsetDragProps<T extends keyof SlideReturn> extends Omit<DragBaseProps, "MapCallback"> {
	SlideDir: T;
	DeltaApply: (delta: SlideReturn[T]) => void;
}

function OffsetDrag<T extends keyof SlideReturn>(props: OffsetDragProps<T>) {
	const ApplyMap = useCallback(
		(start: Vector2, current: Vector2, _, __) => {
			const offset = current.sub(start);
			switch (props.SlideDir) {
				case "X":
					props.DeltaApply(offset.X as SlideReturn[T]);
					break;
				case "Y":
					props.DeltaApply(offset.Y as SlideReturn[T]);
					break;
				case "XY":
					props.DeltaApply(offset as SlideReturn[T]);
					break;
			}
		},
		[props.DeltaApply],
	);
	return <DragBase {...props} MapCallback={ApplyMap}></DragBase>;
}

export default OffsetDrag;
