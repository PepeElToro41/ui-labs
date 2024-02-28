import Roact from "@rbxts/roact";
import Sprites from "./SpriteMap";
import Configs from "Plugin/Configs";

interface SpriteProps {
	Sprite: SpriteName;
	ImageProps?: Omit<Roact.JsxInstanceProperties<ImageLabel>, "Image" | "ImageRectOffset" | "ImageRectSize">;
}

function setProps(props: SpriteProps) {
	return props;
}

export default (setprops: SpriteProps) => {
	const props = setProps(setprops);
	const spriteInfo = Sprites[props.Sprite] as Sprite;
	return (
		<imagelabel
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
			{...props.ImageProps}
			Image={Configs.SpriteIcon}
			ImageRectOffset={spriteInfo.RectOffset}
			ImageRectSize={spriteInfo.RectSize ?? new Vector2(64, 64)}
		></imagelabel>
	);
};
