import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";
import { Div } from "./Styles/Div";

interface AppHolderProps extends PropsWithChildren {}

function setProps(props: AppHolderProps) {
	return props as Required<AppHolderProps>;
}

function AppHolderCreate(setprops: AppHolderProps) {
	const props = setProps(setprops as Required<AppHolderProps>);
	const divRef = useRef<Frame>();
	const { setHolder } = useProducer<RootProducer>();

	useEffect(() => {
		const div = divRef.getValue();
		if (!div) return;
		setHolder(div);
	}, [divRef.getValue()]);

	return (
		<Div Key="App" Ref={divRef}>
			{props[Roact.Children] ?? new Map()}
		</Div>
	);
}
const AppHolder = withHooks(AppHolderCreate);

export = AppHolder;
