import Roact, { useState } from "@rbxts/roact";
import LifetimeComponent from "UI/Holders/LifetimeChildren/LifetimeComponent";
import ToastInfoRender from "./ToastInfoRender";
import { useDebounceEffect, useMountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";

interface ToastInfoProps {
	PreviewEntry: PreviewEntry;
}

function setProps(props: ToastInfoProps) {
	return props as Required<ToastInfoProps>;
}

function ToastInfo(setprops: ToastInfoProps) {
	const props = setProps(setprops);
	const [toastRender, setToastRender] = useState<Roact.Children>();
	const entry = props.PreviewEntry;

	useDebounceEffect(() => setToastRender(undefined), [toastRender], { wait: 0.6 });
	useUpdateEffect(() => {
		const renderMap: Roact.Children = new Map();
		renderMap.set("ZoomDisplay", <ToastInfoRender InfoText={`Zoom: ${entry.Zoom}%`} />);
		setToastRender(renderMap);
	}, [entry.Zoom]);
	useUpdateEffect(() => {
		const renderMap: Roact.Children = new Map();
		renderMap.set("OffsetDisplay", <ToastInfoRender InfoText={`Offset: [${entry.Offset}]`} />);
		setToastRender(renderMap);
	}, [entry.Offset]);

	return <LifetimeComponent>{toastRender}</LifetimeComponent>;
}

export default ToastInfo;
