import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface DropShadowProps {
	Transparency?: Roact.Binding<number> | number;
	Extends?: number;
	Elevation?: Vector2;
}

function setProps(props: DropShadowProps) {
	props.Extends = props.Extends ?? 6;
	props.Elevation = props.Elevation ?? new Vector2(3, 3);
	return props;
}

function DropShadowCreate(setprops: DropShadowProps) {
	const props = identity<Required<DropShadowProps>>(setProps(setprops) as Required<DropShadowProps>);
	return (
		<frame Key="DropShadow" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} ZIndex={0}>
			<imagelabel
				Key="ShadowImage"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://1316045217"
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.Transparency ?? 0.6}
				Position={new UDim2(0.5, props.Elevation.X, 0.5, props.Elevation.Y)}
				ScaleType={Enum.ScaleType.Slice}
				Size={new UDim2(1, props.Extends, 1, props.Extends)}
				SliceCenter={new Rect(10, 10, 118, 118)}
				ZIndex={0}
			/>
		</frame>
	);
}
const DropShadow = withHooks(DropShadowCreate);

export = DropShadow;
