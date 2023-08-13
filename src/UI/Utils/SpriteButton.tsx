import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface SpriteButtonProps {}

function setProps(props: SpriteButtonProps) {
	return props as Required<SpriteButtonProps>;
}

function SpriteButtonCreate(setprops: SpriteButtonProps) {
	const props = setProps(setprops as Required<SpriteButtonProps>);
	return <></>;
}
const SpriteButton = withHooks(SpriteButtonCreate);

export = SpriteButton;
