import { Signal } from "@rbxts/lemon-signal";
import { useBindingListener } from "@rbxts/pretty-react-hooks";
import React, { PropsWithChildren, useBinding, useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useConnection } from "Hooks/Utils/Connection";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import { ToVector2 } from "Utils/NumberUtils";

//This frame is resizable, and can be collapsed

interface ResizableFrameProps extends PropsWithChildren {
	BaseSize: UDim2;
	HandleSize?: number;
	HandleAnchor?: "Left" | "Right" | "Top" | "Bottom";

	ResizeRange: NumberRange;
	MaxBeforeCollapse?: number;
	MinToDeCollapse?: number;
	DragColor?: Color3;
	MaxSize?: Vector2;

	HolderProps?: Omit<React.InstanceProps<Frame>, "Size">;
	FrameProps?: Omit<React.InstanceProps<Frame>, "Size" | "Position" | "AnchorPoint">;

	SetCollapse?: Signal<[collapsed: boolean]>;
	OnResized?: (collapsed: boolean, resized: number) => void;
}

function setProps(props: ResizableFrameProps) {
	props.HandleAnchor = props.HandleAnchor ?? "Right";
	props.MinToDeCollapse = props.MinToDeCollapse ?? props.MaxBeforeCollapse ?? 0;
	props.HandleSize = props.HandleSize ?? 10;
	return props as Required<ResizableFrameProps>;
}

function ResizableFrame(setprops: ResizableFrameProps) {
	const props = setProps(setprops);

	const frameRef = useRef<Frame>();

	const [collapsed, setCollapsed] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [mouseInput, setMouseInput] = useState<InputObject | undefined>(undefined);
	const [resizeAdd, setResizeAdd] = useBinding(new Vector2(0, 0));
	const [absSize, setAbsSize] = useState<Vector2 | undefined>(undefined);

	const isWidthResizable = props.HandleAnchor === "Left" || props.HandleAnchor === "Right";
	const isHeightResizable = props.HandleAnchor === "Top" || props.HandleAnchor === "Bottom";

	const resizeMultiply = new Vector2(props.HandleAnchor === "Left" ? -1 : 1, props.HandleAnchor === "Top" ? -1 : 1).mul(
		new Vector2(isWidthResizable ? 1 : 0, isHeightResizable ? 1 : 0)
	);

	useBindingListener(resizeAdd, (adder) => {
		InformResized(adder);
		if (props.MaxBeforeCollapse === undefined) return; //Collapsing is disabled
		if (!collapsed) {
			if (adder.X < props.MaxBeforeCollapse || adder.Y < props.MaxBeforeCollapse) {
				setCollapsed(true);
			}
		} else {
			if (
				(adder.X > props.MaxBeforeCollapse && isWidthResizable) ||
				(adder.Y > props.MaxBeforeCollapse && isHeightResizable)
			) {
				setCollapsed(false);
			}
		}
	});

	useEffect(() => {
		if (!collapsed) {
			//Clamping
			const old = resizeAdd.getValue();

			setResizeAdd(
				new Vector2(
					math.clamp(old.X, props.ResizeRange.Min, props.ResizeRange.Max),
					math.clamp(old.Y, props.ResizeRange.Min, props.ResizeRange.Max)
				)
			);
		}
		if (!isDragging) {
			if (collapsed) {
				if (!absSize) return;
				setResizeAdd(absSize.mul(new Vector2(-math.abs(resizeMultiply.X), -math.abs(resizeMultiply.Y))));
			}
			return;
		}
		if (!mouseInput) return;

		const mouseStart = ToVector2(mouseInput.Position);
		const resizeStart = resizeAdd.getValue();
		const runListener = RunService.Heartbeat.Connect(() => {
			const mousePos = ToVector2(mouseInput.Position);
			const mouseDelta = mousePos.sub(mouseStart).mul(resizeMultiply);
			const resizeDelta = mouseDelta.add(resizeStart);
			setResizeAdd(resizeDelta);
		});

		return () => {
			runListener.Disconnect();
		};
	}, [isDragging]);

	const InformResized = (added?: Vector2) => {
		const setAdded = added ?? resizeAdd.getValue();
		RecordAbsolute(setAdded);
		if (props.OnResized) {
			props.OnResized(collapsed, math.clamp(setAdded.X + setAdded.Y, props.ResizeRange.Min, props.ResizeRange.Max));
		}
	};

	const RecordAbsolute = (added: Vector2) => {
		//I wasnt able to find a better way to record the start size
		if (collapsed) return;
		if (added !== Vector2.zero) return;
		const frame = frameRef.current;
		if (!frame) return;
		setAbsSize(frame.AbsoluteSize);
	};

	useEffect(() => {
		InformResized();
	}, [collapsed]);

	useConnection(props.SetCollapse, (collapsed: boolean) => {
		setCollapsed(collapsed);
		setIsDragging(false);
	});

	const dragHandleX = props.HandleAnchor === "Left" ? 0 : props.HandleAnchor === "Right" ? 1 : 0.5;
	const dragHandleY = props.HandleAnchor === "Top" ? 0 : props.HandleAnchor === "Bottom" ? 1 : 0.5;

	return (
		<Div
			Size={
				collapsed
					? isWidthResizable //collapsed, size to zero
						? new UDim2(0, 0, props.BaseSize.Y.Scale, props.BaseSize.Y.Offset)
						: new UDim2(props.BaseSize.X.Scale, props.BaseSize.X.Offset, 0, 0)
					: resizeAdd.map((add) => {
							//not collapsed, mapping resize vector
							return props.BaseSize.add(
								UDim2.fromOffset(
									math.clamp(add.X, props.ResizeRange.Min, props.ResizeRange.Max),
									math.clamp(add.Y, props.ResizeRange.Min, props.ResizeRange.Max)
								)
							);
						})
			}
			{...props.HolderProps}
			ref={frameRef}
		>
			{props.MaxSize && <uisizeconstraint MaxSize={props.MaxSize} />}

			<frame
				key="DragAdornee"
				BackgroundColor3={props.DragColor ?? Color3.fromRGB(56, 165, 255)}
				AnchorPoint={new Vector2(isDragging ? 0.5 : 1 - dragHandleX, isDragging ? 0.5 : 1 - dragHandleY)}
				BorderSizePixel={0}
				BackgroundTransparency={isDragging ? 0 : mouseInput ? 0.5 : 1}
				Position={new UDim2(dragHandleX, 0, dragHandleY, 0)}
				Size={isWidthResizable ? new UDim2(0, isDragging ? 2 : 1, 1, 0) : new UDim2(1, 0, 0, isDragging ? 2 : 1)}
				ZIndex={2}
			></frame>
			<Detector
				key="DragHandle"
				Position={new UDim2(dragHandleX, 0, dragHandleY, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={isWidthResizable ? new UDim2(0, props.HandleSize, 1, 0) : new UDim2(1, 0, 0, props.HandleSize)}
				ZIndex={3}
				Event={{
					MouseLeave: () => {
						if (!isDragging) setMouseInput(undefined);
					},
					InputBegan: (_, input) => {
						if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							setIsDragging(true);
						}
						if (input.UserInputType === Enum.UserInputType.MouseMovement) {
							setMouseInput(input);
						}
					},
					InputEnded: (_, input) => {
						if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							setIsDragging(false);
							setMouseInput(undefined);
						}
					}
				}}
			></Detector>
			<Div key="Contents" Visible={!collapsed} {...(props.FrameProps ?? {})}>
				{props["children"] ? props["children"] : undefined}
			</Div>
		</Div>
	);
}

export default ResizableFrame;
