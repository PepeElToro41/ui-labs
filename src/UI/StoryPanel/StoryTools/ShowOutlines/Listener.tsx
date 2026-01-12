import React, { useEffect } from "@rbxts/react";

import { MIN_SIZE } from "./Utils";

interface ListenerProps {
	Component: GuiObject;
	OnImportantChange: () => void;
}

function Listener(props: ListenerProps) {
	useEffect(() => {
		let called = false;

		const Call = () => {
			if (called) return;
			called = true;
			props.OnImportantChange();
		};

		const visible = props.Component.GetPropertyChangedSignal("Visible").Connect(() => {
			if (props.Component.Visible) {
				Call();
			}
		});
		const absoluteSize = props.Component.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			if (props.Component.AbsoluteSize.X >= MIN_SIZE && props.Component.AbsoluteSize.Y >= MIN_SIZE) {
				Call();
			}
		});

		return () => {
			visible.Disconnect();
			absoluteSize.Disconnect();
		};
	}, [props.Component]);

	return <React.Fragment></React.Fragment>;
}

export default Listener;
