import Roact from "@rbxts/roact";
import { useCallback, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { DragBase, DragBaseProps, SlideReturn } from "./DragBase";

interface DeltaDragProps<T extends keyof SlideReturn> extends Omit<DragBaseProps, "MapCallback"> {
	SlideDir: T;
	DeltaApply: (delta: SlideReturn[T]) => void;
}

function DeltaDragCreate<T extends keyof SlideReturn>(props: DeltaDragProps<T>) {
	const ApplyMap = useCallback(
		(started: Vector2, current: Vector2, last: Vector2, slidePos: Vector2[]) => {
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
const DeltaDrag = withHooks(DeltaDragCreate);

export = DeltaDrag;
