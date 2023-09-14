import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useContext, useEffect, useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import { RunService } from "@rbxts/services";
import { MouseIconContext } from "UI/Contexts/Mouse/MouseIconContext";
import { Detector } from "./Styles/Detector";
import { Div } from "./Styles/Div";

interface ResizableFrameProps extends PropsWithChildren {
	BaseSize: UDim2;
	HandleSize?: number;
	HandleAnchor?: "Left" | "Right" | "Top" | "Bottom";
	ResizeRange: NumberRange;
	MaxBeforeCollapse?: number;
	MinToDeCollapse?: number;
	HolderProps?: PropsExclude<Frame, "Size">;
	FrameProps?: Omit<JSX.IntrinsicElement<Frame>, "Size" | "Position" | "AnchorPoint">;
	OnResized?: (collapsed: boolean, resizeAdd: number) => void;
}

function setProps(props: ResizableFrameProps) {
	props.HandleAnchor = props.HandleAnchor ?? "Right";
	props.MinToDeCollapse = props.MinToDeCollapse ?? props.MaxBeforeCollapse ?? 0;
	props.HandleSize = props.HandleSize ?? 10;
	return props;
}

function ResizableFrameCreate(setprops: ResizableFrameProps) {
	const props = identity<Required<ResizableFrameProps>>(setProps(setprops) as Required<ResizableFrameProps>);
	//STATES
	const [isDragging, setIsDragging] = useState(false);
	const [mouseInput, setMouseInput] = useState<InputObject | undefined>(undefined);
	const [resizeAdd, setResizeAdd] = useState(new Vector3(0, 0, 0));
	const [collapsed, setCollapsed] = useState(false);
	const mouseIcon = useContext(MouseIconContext);

	//DEFINED
	const isWidthResizable = props.HandleAnchor === "Left" || props.HandleAnchor === "Right";
	const isHeightResizable = props.HandleAnchor === "Top" || props.HandleAnchor === "Bottom";
	const resizeMultiply = new Vector3(props.HandleAnchor === "Left" ? -1 : 1, props.HandleAnchor === "Top" ? -1 : 1).mul(
		new Vector3(isWidthResizable ? 1 : 0, isHeightResizable ? 1 : 0, 0),
	);

	useEffect(() => {
		if (mouseInput) {
			if (isWidthResizable) {
				mouseIcon.SetMouseIcon("ResizingFrame", "ResizeH");
			} else if (isHeightResizable) {
				mouseIcon.SetMouseIcon("ResizingFrame", "ResizeV");
			}
		} else {
			mouseIcon.UnsetMouseIcon("ResizingFrame");
		}
	}, [mouseInput]);
	useEffect(() => {
		if (!props.MaxBeforeCollapse) return;
		if (!collapsed) {
			if (resizeAdd.X < props.MaxBeforeCollapse || resizeAdd.Y < props.MaxBeforeCollapse) {
				setCollapsed(true);
			}
		} else {
			if (
				(resizeAdd.X > props.MaxBeforeCollapse && isWidthResizable) ||
				(resizeAdd.Y > props.MaxBeforeCollapse && isHeightResizable)
			) {
				setCollapsed(false);
			}
		}
	}, [resizeAdd]);
	useEffect(() => {
		if (!collapsed) {
			setResizeAdd((oldSize) => {
				return new Vector3(
					math.clamp(oldSize.X, props.ResizeRange.Min, props.ResizeRange.Max),
					math.clamp(oldSize.Y, props.ResizeRange.Min, props.ResizeRange.Max),
					0,
				);
			});
		}
		if (!isDragging) {
			return;
		}
		if (!mouseInput) {
			return;
		}
		const mouseStart = mouseInput.Position;
		const resizeStart = resizeAdd;
		const runListener = RunService.Heartbeat.Connect(() => {
			const mousePos = mouseInput.Position;
			const mouseDelta = mousePos.sub(mouseStart).mul(resizeMultiply);
			const resizeDelta = mouseDelta.add(resizeStart);
			setResizeAdd(resizeDelta);
		});
		return () => {
			runListener.Disconnect();
		};
	}, [isDragging]);
	useEffect(() => {
		if (props.OnResized) {
			props.OnResized(collapsed, math.clamp(resizeAdd.X + resizeAdd.Y, props.ResizeRange.Min, props.ResizeRange.Max));
		}
	}, [collapsed, resizeAdd]);
	const xPos = props.HandleAnchor === "Left" ? 0 : props.HandleAnchor === "Right" ? 1 : 0.5;
	const yPos = props.HandleAnchor === "Top" ? 0 : props.HandleAnchor === "Bottom" ? 1 : 0.5;
	return (
		<Div
			Size={
				collapsed
					? isHeightResizable
						? new UDim2(props.BaseSize.Width.Scale, props.BaseSize.Width.Offset, 0, 0)
						: new UDim2(0, 0, props.BaseSize.Height.Scale, props.BaseSize.Height.Offset)
					: props.BaseSize.add(
							UDim2.fromOffset(
								math.clamp(resizeAdd.X, props.ResizeRange.Min, props.ResizeRange.Max),
								math.clamp(resizeAdd.Y, props.ResizeRange.Min, props.ResizeRange.Max),
							),
					  )
			}
			{...props.HolderProps}
		>
			<frame
				Key="DragAdornee"
				BackgroundColor3={new Color3(0.22, 0.65, 1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundTransparency={isDragging ? 0 : mouseInput ? 0.5 : 1}
				Position={new UDim2(xPos, 0, yPos, 0)}
				Size={isWidthResizable ? new UDim2(0, isDragging ? 2 : 1, 1, 0) : new UDim2(1, 0, 0, isDragging ? 2 : 1)}
			></frame>
			<Detector
				Key="DragHandle"
				Position={new UDim2(xPos, 0, yPos, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={isWidthResizable ? new UDim2(0, props.HandleSize, 1, 0) : new UDim2(1, 0, 0, props.HandleSize)}
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
					},
				}}
			></Detector>
			<Div Key="Contents" Visible={!collapsed} {...(props.FrameProps ?? {})}>
				{props[Roact.Children] ? props[Roact.Children] : undefined}
			</Div>
		</Div>
	);
}
const ResizableFrame = withHooks(ResizableFrameCreate);

export = ResizableFrame;
