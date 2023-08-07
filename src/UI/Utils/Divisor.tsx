import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface DivisorProps {
	Direction?: "X" | "Y";
	Position?: UDim2;
	Anchor?: number;
	Size?: UDim;
	Thickness?: number;
	Color?: Color3;
}

function setProps(props: DivisorProps) {
	props.Direction = props.Direction ?? "X";
	props.Thickness = props.Thickness ?? 1;
	props.Anchor = props.Anchor ?? 0.5;
	props.Size = props.Size ?? new UDim(1, 0);
	return props as Required<DivisorProps>;
}

function DivisorCreate(setprops: DivisorProps) {
	const props = setProps(setprops);
	const theme = useTheme();
	return (
		<frame
			Key={"Divisor"}
			AnchorPoint={props.Direction === "X" ? new Vector2(props.Anchor, 0.5) : new Vector2(0.5, props.Anchor)}
			BackgroundColor3={props.Color ?? theme.Divisor.Color}
			BackgroundTransparency={theme.Divisor.Transparency}
			BorderSizePixel={0}
			Position={props.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={
				props.Direction === "X"
					? new UDim2(props.Size.Scale, props.Size.Offset, 0, props.Thickness)
					: new UDim2(0, props.Thickness, props.Size.Scale, props.Size.Offset)
			}
		/>
	);
}

const Divisor = withHooks(DivisorCreate);

export = Divisor;
