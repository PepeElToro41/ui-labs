import Vide, { cleanup, Derivable, effect, Source, source, untrack } from "@rbxts/vide";
import Detector from "UI/Styles/Detector";
import Div from "UI/Styles/Div";
import DragDetector from "UI/Styles/DragDetector";
import Frame from "UI/Styles/Frame";
import { UDimOffset } from "Utils/NumberUtils";
import { InitSource, SourceInit } from "Utils/Vide";
import { ListenHovered } from "Utils/Vide/Actions";

interface ResizablePanelProps {
	HandleThickness?: number;
	HandleAxis?: "Top" | "Bottom" | "Left" | "Right";
	Size?: Derivable<UDim2>;
	PanelNative?: Vide.InstanceAttributes<Frame>;
	HolderNative?: Vide.InstanceAttributes<Frame>;

	PanelSize: SourceInit<number>;
	MinimumSize?: number;
	MaximumSize?: number;

	CollapseThreshold?: number;
	UncollapseThreshold?: number;

	Collapsed?: Source<boolean>;

	children?: Vide.Node;
}

function ResizablePanel(props: ResizablePanelProps) {
	const dragging = source(false);
	const hovered = source(false);
	const collapsed = props.Collapsed ?? source(false);
	const panelSize = InitSource(props.PanelSize);
	const detectorRef = source<UIDragDetector>(undefined!);

	const handleAnchor = props.HandleAxis ?? "Right";
	const usesWith = handleAnchor === "Left" || handleAnchor === "Right";
	const handleX = handleAnchor === "Left" ? 0 : handleAnchor === "Right" ? 1 : 0.5;
	const handleY = handleAnchor === "Top" ? 0 : handleAnchor === "Bottom" ? 1 : 0.5;

	function OffsetUDim2(usesWidth: boolean, offset: number, base: UDim2) {
		if (usesWidth) {
			return new UDim2(0, offset, base.Y.Scale, base.Y.Offset);
		}
		return new UDim2(base.X.Scale, base.X.Offset, 0, offset);
	}
	function ClampedPanelSize() {
		return math.clamp(panelSize(), props.MinimumSize ?? 0, props.MaximumSize ?? math.huge);
	}

	function ResetDragging() {
		if (untrack(collapsed)) {
			panelSize(0); // if collapsed, panel size should reset back to 0
		} else {
			panelSize(untrack(ClampedPanelSize));
		}
	}

	effect(() => {
		const detector = detectorRef();

		cleanup(ResetDragging);
		if (!dragging()) return;

		const multiplier = handleX * 2 - 1 + (handleY * 2 - 1);
		const start = UDimOffset(detector.DragUDim2);
		const base = untrack(panelSize);

		cleanup(
			detector.DragContinue.Connect(() => {
				const delta = (UDimOffset(detector.DragUDim2) - start) * multiplier;
				panelSize(math.clamp(base + delta, 0, props.MaximumSize ?? math.huge));
			}),
		);
	});

	effect(() => {
		if (props.CollapseThreshold !== undefined) {
			if (panelSize() < props.CollapseThreshold) {
				collapsed(true);
			}
		}
		if (props.UncollapseThreshold !== undefined) {
			if (panelSize() >= props.UncollapseThreshold) {
				collapsed(false);
			}
		}
	});
	effect(() => {
		if (collapsed()) {
			panelSize(0);
		}
	});

	return (
		<Div
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(1 - math.floor(handleX), 1 - math.floor(handleY))}
			{...props.PanelNative}
			Size={() => {
				if (collapsed()) {
					return OffsetUDim2(usesWith, 0, UDim2.fromScale(1, 1));
				}

				return OffsetUDim2(usesWith, ClampedPanelSize(), UDim2.fromScale(1, 1));
			}}
		>
			<Frame
				Name={"DragAdornee"}
				BackgroundColor3={Color3.fromRGB(56, 165, 255)}
				Position={UDim2.fromScale(handleX, handleY)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Visible={() => dragging() || hovered()}
				ZIndex={2}
				Size={() => {
					return OffsetUDim2(usesWith, dragging() ? 2 : 1, UDim2.fromScale(1, 1));
				}}
			/>
			<Detector
				action={ListenHovered(hovered)}
				Position={UDim2.fromScale(handleX, handleY)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={OffsetUDim2(usesWith, props.HandleThickness ?? 10, UDim2.fromScale(1, 1))}
				ZIndex={2}
			>
				<DragDetector
					DragRelativity={"Relative"}
					ResponseStyle={"CustomOffset"}
					DragStyle={"TranslateLine"}
					DragAxis={new Vector2(handleX * 2 - 1, handleY * 2 - 1)}
					Dragging={dragging}
					ref={detectorRef}
				></DragDetector>
			</Detector>
			<Frame Name={"Contents"} {...props.HolderNative} Size={UDim2.fromScale(1, 1)} Visible={() => !collapsed()}>
				{props.children}
			</Frame>
		</Div>
	);
}

export default ResizablePanel;
