import Roact from "@rbxts/roact";
import { useCallback, withHooks } from "@rbxts/roact-hooked";
import { DragBase, DragBaseProps, SlideReturn } from "./DragBase";

interface SlideDragProps<T extends keyof SlideReturn> extends Omit<DragBaseProps, "MapCallback"> {
	SlideDir: T;
	NoClamp?: boolean;
	UnitType?: "Percent" | "Pixel";
	PercentApply: (percent: SlideReturn[T]) => void;
}

const clp = math.clamp;

function SlideDragCreate<T extends keyof SlideReturn>(props: SlideDragProps<T>) {
	const unitType = props.UnitType ?? "Percent";
	const ApplyMap = useCallback(
		(started: Vector2, current: Vector2, last: Vector2, slidePos: Vector2[]) => {
			const [rectPos, rectSize] = slidePos;
			let percent = current.sub(rectPos);
			if (props.NoClamp !== true) {
				percent = new Vector2(clp(percent.X, 0, rectSize.X), clp(percent.Y, 0, rectSize.Y));
			}
			if (unitType === "Percent") {
				percent = percent.div(rectSize);
			}
			switch (props.SlideDir) {
				case "X":
					props.PercentApply(percent.X as SlideReturn[T]);
					break;
				case "Y":
					props.PercentApply(percent.Y as SlideReturn[T]);
					break;
				case "XY":
					props.PercentApply(percent as SlideReturn[T]);
					break;
			}
		},
		[props.PercentApply],
	);

	return <DragBase {...props} MapCallback={ApplyMap}></DragBase>;
}
const SlideDrag = withHooks(SlideDragCreate);

export = SlideDrag;
