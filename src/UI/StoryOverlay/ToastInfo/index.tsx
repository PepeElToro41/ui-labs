import { useDebounceEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectFullscreen } from "Reflex/Interface";
import LifetimeComponent from "UI/Holders/LifetimeChildren/LifetimeComponent";
import ToastInfoRender from "./ToastInfoRender";

interface ToastInfoProps {
	PreviewEntry: PreviewEntry;
}

function setProps(props: ToastInfoProps) {
	return props as Required<ToastInfoProps>;
}

function ToastInfo(setprops: ToastInfoProps) {
	const props = setProps(setprops);
	const [toastRender, setToastRender] = useState<ReactChildren>();
	const entry = props.PreviewEntry;
	const fullscreen = useSelector(selectFullscreen);

	useDebounceEffect(() => setToastRender(undefined), [toastRender], {
		wait: 0.6
	});
	useUpdateEffect(() => {
		const renderMap: ReactChildren = new Map();
		renderMap.set(
			"OffsetDisplay",
			<ToastInfoRender
				InfoText={`Offset: [${math.round(entry.Offset.X)}, ${math.round(entry.Offset.Y)}]`}
			/>
		);
		setToastRender(renderMap);
	}, [entry.Offset]);
	useUpdateEffect(() => {
		const renderMap: ReactChildren = new Map();
		renderMap.set(
			"ZoomDisplay",
			<ToastInfoRender InfoText={`Zoom: ${math.round(entry.Zoom)}%`} />
		);
		setToastRender(renderMap);
	}, [entry.Zoom]);
	useUpdateEffect(() => {
		const renderMap: ReactChildren = new Map();
		renderMap.set(
			"FullscreenMode",
			<ToastInfoRender
				InfoText={`Fullscreen Mode: ${fullscreen ? "On" : "Off"}`}
			/>
		);
		setToastRender(renderMap);
	}, [fullscreen]);

	return <LifetimeComponent>{toastRender}</LifetimeComponent>;
}

export default ToastInfo;
