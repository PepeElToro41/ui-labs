import React, { PropsWithChildren, useEffect, useRef } from "@rbxts/react";
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
		<Div key="Holder" ref={divRef}>
			{props["children"] ?? new Map()}
		</Div>
	);
}

export default AppHolder;
