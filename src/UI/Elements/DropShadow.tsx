import Vide, { Derivable } from "@rbxts/vide";
import Div from "UI/Styles/Div";

interface DropShadowProps extends Display {
	Transparency?: Derivable<number>;
	Visible?: boolean;
	Extends?: number | Vector2;
	Elevation?: Vector2;
}

function setProps(props: DropShadowProps) {
	props.Extends = props.Extends ?? 4;
	props.Visible = props.Visible ?? true;
	props.Elevation = props.Elevation ?? new Vector2(2, 2);
	return props as Required<DropShadowProps>;
}

function DropShadow(setprops: DropShadowProps) {
	const props = setProps(setprops);
	const extend = props.Extends;

	const sizeUdim = typeIs(extend, "Vector2") ? new UDim2(1, extend.X, 1, extend.Y) : new UDim2(1, extend, 1, extend);

	return (
		<Div Name="DropShadow" BackgroundTransparency={1} ZIndex={props.ZIndex ?? 0} Visible={props.Visible}>
			<imagelabel
				Name="Shadow"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://1316045217"
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.Transparency ?? 0.6}
				Position={new UDim2(0.5, props.Elevation.X, 0.5, props.Elevation.Y)}
				ScaleType={Enum.ScaleType.Slice}
				Size={sizeUdim}
				SliceCenter={new Rect(10, 10, 118, 118)}
				ZIndex={0}
			/>
		</Div>
	);
}

export default DropShadow;
