import Roact from "@rbxts/roact";
import { useBinding, useEffect, useMemo, useRef, withHooks, withHooksPure } from "@rbxts/roact-hooked";

interface PositionBinderProps extends JSX.IntrinsicElement<Frame> {
	BindSet: ((bindState: [Vector2, Vector2]) => void) | undefined;
}

function setProps(props: PositionBinderProps) {
	return props;
}

function PositionBinderCreate(props: PositionBinderProps) {
	const setter = useMemo(() => props.BindSet!, []);
	const frameRef = useRef<Frame>();
	useBinding;
	props.BindSet = undefined;
	useEffect(() => {
		const frame = frameRef.getValue();
		if (!frame) return;
		setter([frame.AbsolutePosition, frame.AbsoluteSize]);
	}, []);
	return (
		<frame
			Ref={frameRef}
			Change={{
				AbsolutePosition: (frame) => {
					setter([frame.AbsolutePosition, frame.AbsoluteSize]);
				},
				AbsoluteSize: (frame) => {
					setter([frame.AbsolutePosition, frame.AbsoluteSize]);
				},
			}}
			{...props}
		></frame>
	);
}
const PositionBinder = withHooksPure(PositionBinderCreate);

export = PositionBinder;
