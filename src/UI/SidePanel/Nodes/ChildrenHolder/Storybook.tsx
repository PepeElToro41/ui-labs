import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface StorybookProps {}

function setProps(props: StorybookProps) {
	return props as Required<StorybookProps>;
}

function StorybookCreate(setprops: StorybookProps) {
	const props = setProps(setprops as Required<StorybookProps>);
	return <></>;
}
const Storybook = withHooks(StorybookCreate);

export = Storybook;
