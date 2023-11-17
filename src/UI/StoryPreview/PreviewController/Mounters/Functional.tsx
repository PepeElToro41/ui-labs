import Roact from "@rbxts/roact";
import { useEffect, withHooks } from "@rbxts/roact-hooked";
import { FunctionalStory } from "@rbxts/ui-labs";

interface FunctionalProps {
	Result: FunctionalStory;
	MountFrame: Frame;
}

function setProps(props: FunctionalProps) {
	return props as Required<FunctionalProps>;
}

function FunctionalCreate(setprops: FunctionalProps) {
	const props = setProps(setprops as Required<FunctionalProps>);
	useEffect(() => {
		const unmounter = props.Result(props.MountFrame);
		return () => {
			unmounter();
		};
	});
	return undefined;
}
const Functional = withHooks(FunctionalCreate);

export = Functional;
