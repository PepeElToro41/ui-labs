import Vide, { cleanup, Source } from "@rbxts/vide";

interface DragDetectorProps extends Vide.InstanceAttributes<UIDragDetector> {
	Dragging?: Source<boolean>;
	DragChanged?: (delta: UDim2) => void;
}

export function ListenDragging(source: Source<boolean>) {
	return (detector: UIDragDetector) => {
		const dragStart = detector.DragStart.Connect(() => source(true));
		const dragEnd = detector.DragEnd.Connect(() => source(false));

		cleanup(() => {
			dragStart.Disconnect();
			dragEnd.Disconnect();
		});
	};
}

function DragDetector(props: DragDetectorProps) {
	const dragging = props.Dragging;
	const DragChanged = props.DragChanged;

	props.Dragging = undefined;
	props.DragChanged = undefined;

	const dragger = (<uidragdetector {...props}>{props.children}</uidragdetector>) as UIDragDetector;

	if (dragging) {
		ListenDragging(dragging)(dragger);
	}
	if (DragChanged) {
		cleanup(
			dragger.DragContinue.Connect(() => {
				DragChanged(dragger.DragUDim2);
			}),
		);
	}

	return dragger;
}

export default DragDetector;
