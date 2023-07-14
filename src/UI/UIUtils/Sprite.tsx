import Roact from "@rbxts/roact";
import Configs from "Plugin/Configs";

interface SpriteProps extends JSX.IntrinsicElement<ImageLabel> {}

function setProps(props: SpriteProps) {
	return props;
}

export function Sprite(setprops: SpriteProps) {
	const props = setProps(setprops);
	return (
		<imagelabel
			{...{
				BackgroundTransparency: 1,
				Size: UDim2.fromScale(1, 1),
				BorderSizePixel: 0,
				Image: Configs.IconsSprite,
				ImageRectSize: new Vector2(64, 64),
				...props,
			}}
		></imagelabel>
	);
}
