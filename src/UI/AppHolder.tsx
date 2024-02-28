import Roact, { PropsWithChildren, useEffect, useRef } from "@rbxts/roact";
import { useProducer } from "@rbxts/react-reflex";
import { Div } from "./Styles/Div";

interface AppHolderProps extends PropsWithChildren {}

function setProps(props: AppHolderProps) {
	return props as Required<AppHolderProps>;
}

function AppHolder(setprops: AppHolderProps) {
	const props = setProps(setprops);
	const divRef = useRef<Frame>();
	const { setHolder } = useProducer<RootProducer>();

	useEffect(() => {
		const div = divRef.current;
		if (!div) return;
		setHolder(div);
	}, [divRef.current]);

	return (
		<Div Key="App" Reference={divRef}>
			{props["children"] ?? new Map()}
		</Div>
	);
}

export default AppHolder;
