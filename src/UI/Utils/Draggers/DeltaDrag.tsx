import React, { useCallback } from "@rbxts/react";
import DragBase, { DragBaseProps, SlideReturn } from "./DragBase";

interface DeltaDragProps<T extends keyof SlideReturn> extends Omit<DragBaseProps, "MapCallback"> {
	SlideDir: T;
	DeltaApply: (delta: SlideReturn[T]) => void;
}

function DeltaDrag<T extends keyof SlideReturn>(props: DeltaDragProps<T>) {
	const ApplyMap = useCallback(
		(_, current: Vector2, last: Vector2, __) => {
			const delta = current.sub(last);
			switch (props.SlideDir) {
				case "X":
					props.DeltaApply(delta.X as SlideReturn[T]);
					break;
				case "Y":
					props.DeltaApply(delta.Y as SlideReturn[T]);
					break;
				case "XY":
					props.DeltaApply(delta as SlideReturn[T]);
					break;
			}
		},
		[props.DeltaApply],
	);
	return <DragBase {...props} MapCallback={ApplyMap}></DragBase>;
}

export default DeltaDrag;
