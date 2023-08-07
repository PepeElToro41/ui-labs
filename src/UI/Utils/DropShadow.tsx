import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface DropShadowProps {
	Transparency: Roact.Binding<number> | number;
	Extends?: number;
}

function setProps(props: DropShadowProps) {
	props.Extends = props.Extends ?? 6;
	return props;
}

function DropShadowCreate(setprops: DropShadowProps) {
	const props = identity<Required<DropShadowProps>>(setProps(setprops) as Required<DropShadowProps>);
	return (
		<frame Key="DropShadow" BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} ZIndex={0}>
			<imagelabel
				Key="umbraShadow"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://1316045217"
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.Transparency}
				Position={new UDim2(0.5, 0, 0.5, 4)}
				ScaleType={Enum.ScaleType.Slice}
				Size={UDim2.fromScale(1, 1).add(UDim2.fromOffset(props.Extends * 1.8, props.Extends * 1.8))}
				SliceCenter={new Rect(10, 10, 118, 118)}
				ZIndex={0}
			/>
			<imagelabel
				Key="penumbraShadow"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://1316045217"
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.Transparency}
				Position={new UDim2(0.5, 0, 0.5, 4)}
				ScaleType={Enum.ScaleType.Slice}
				Size={UDim2.fromScale(1, 1).add(UDim2.fromOffset(props.Extends * 1.4, props.Extends * 1.4))}
				SliceCenter={new Rect(10, 10, 118, 118)}
				ZIndex={1}
			/>
			<imagelabel
				Key="ambientShadow"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image="rbxassetid://1316045217"
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.Transparency}
				Position={new UDim2(0.5, 0, 0.5, 3)}
				ScaleType={Enum.ScaleType.Slice}
				Size={UDim2.fromScale(1, 1).add(UDim2.fromOffset(props.Extends, props.Extends))}
				SliceCenter={new Rect(10, 10, 118, 118)}
				ZIndex={2}
			/>
		</frame>
	);
}
const DropShadow = withHooks(DropShadowCreate);

export = DropShadow;
