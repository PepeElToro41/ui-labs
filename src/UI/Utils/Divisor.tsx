import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface DivisorProps {
	Position?: UDim2;
	Anchor?: number;
	Size?: UDim;
	Order?: number;
	ZIndex?: number;

	Color?: Color3;
	Transparency?: number;

	Direction?: "X" | "Y";
	Thickness?: number;
	Visible?: boolean;
}

function setProps(props: DivisorProps) {
	props.Direction = props.Direction ?? "X";
	props.Thickness = props.Thickness ?? 1;
	props.Anchor = props.Anchor ?? 0.5;
	props.Size = props.Size ?? new UDim(1, 0);
	return props as Required<DivisorProps>;
}

function Divisor(setprops: DivisorProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	return (
		<frame
			key={"Divisor"}
			AnchorPoint={props.Direction === "X" ? new Vector2(props.Anchor, 0.5) : new Vector2(0.5, props.Anchor)}
			BackgroundColor3={props.Color ?? theme.Divisor.Color}
			BackgroundTransparency={props.Transparency ?? theme.Divisor.Transparency}
			BorderSizePixel={0}
			LayoutOrder={props.Order ?? 0}
			Position={props.Position ?? UDim2.fromScale(0.5, 0.5)}
			ZIndex={props.ZIndex ?? 1}
			Visible={props.Visible ?? true}
			Size={
				props.Direction === "X"
					? new UDim2(props.Size.Scale, props.Size.Offset, 0, props.Thickness)
					: new UDim2(0, props.Thickness, props.Size.Scale, props.Size.Offset)
			}
		/>
	);
}

export default Divisor;
