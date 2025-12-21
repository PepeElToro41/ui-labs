import React, { PropsWithChildren, useBinding, useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useConnection } from "Hooks/Utils/Connection";

//This frame completly fills a parent frame. Its size is determined by how much space it has left depending on it's position

interface FrameFillProps extends PropsWithChildren {
	FrameProps?: Omit<React.InstanceAttributes<Frame>, "Size" | "AnchorPoint" | "SizeConstraint">;
	Size?: UDim2;
	FillDir?: "X" | "Y" | "XY";
	AnchorPoint?: Vector2; //The anchor point determines the fill direction
}

function setProps(props: FrameFillProps) {
	props.Size = props.Size ?? new UDim2(1, 0, 1, 0);
	props.FillDir = props.FillDir ?? "X";

	const point = props.AnchorPoint ?? new Vector2(0, 0);
	props.AnchorPoint = new Vector2(math.clamp(math.round(point.X), 0, 1), math.clamp(math.round(point.Y), 0, 1));

	return props as Required<FrameFillProps>;
}

function FrameFill(setprops: FrameFillProps) {
	const props = setProps(setprops);
	const [parent, setParent] = useState<GuiObject | undefined>(undefined);
	const [size, setSize] = useBinding<UDim2>(props.Size);
	const frameRef = useRef<Frame>();

	const shouldFillX = props.FillDir === "X" || props.FillDir === "XY";
	const shouldFillY = props.FillDir === "Y" || props.FillDir === "XY";

	const calculateSize = () => {
		if (!parent) return;
		const frame = frameRef.current;
		if (!frame) return;
		const relativePos = frame.AbsolutePosition.sub(parent.AbsolutePosition);
		const anchorPos = relativePos.add(frame.AbsoluteSize.mul(props.AnchorPoint));

		const filledX = props.AnchorPoint.X > 0 ? anchorPos.X : parent.AbsoluteSize.X - anchorPos.X;
		const filledY = props.AnchorPoint.Y > 0 ? anchorPos.Y : parent.AbsoluteSize.Y - anchorPos.Y;

		const udimX = shouldFillX ? new UDim(0, filledX) : new UDim(props.Size.X.Scale, props.Size.X.Offset);
		const udimY = shouldFillY ? new UDim(0, filledY) : new UDim(props.Size.Y.Scale, props.Size.Y.Offset);

		setSize(new UDim2(udimX.Scale, udimX.Offset, udimY.Scale, udimY.Offset));
	};
	useConnection(RunService.RenderStepped, () => calculateSize(), [parent]);
	useEffect(() => {
		const parent = frameRef.current?.Parent;
		if (!parent || !parent.IsA("GuiObject")) return;
		setParent(parent);
	}, [frameRef.current]);

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			{...(props.FrameProps ?? {})}
			AnchorPoint={props.AnchorPoint}
			Size={size}
			ref={frameRef}
			Change={{
				Parent: (frame) => {
					const frameParent = frame.Parent;
					if (!frameParent || !frameParent.IsA("GuiObject")) return;
					setParent(frameParent);
				}
			}}
		>
			{props["children"] ?? {}}
		</frame>
	);
}

export default FrameFill;
