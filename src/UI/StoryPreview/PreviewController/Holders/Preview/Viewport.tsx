import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useRef } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { useWidgetStateContext } from "Context/WidgetStateContext";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Viewport(props: StoryHolderProps) {
	const mountRef = useRef<Frame>();
	const widgetState = useWidgetStateContext();
	const storyName = RemoveExtension(
		props.PreviewEntry.Module.Name,
		Configs.Extensions.Story
	);

	useDeferLifetime(props, 2);

	useMountEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		props.MountFrame.Parent = holder;
		props.ListenerFrame.Parent = holder;
	});

	useEffect(() => {
		props.SetCanReload(widgetState.ViewportFocused);
	}, [widgetState.ViewportFocused, props.SetCanReload]);

	return createPortal(
		<screengui key={storyName} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
			<Div key={"Holder"} ref={mountRef}></Div>
		</screengui>,
		game.GetService("CoreGui")
	);
}

export default Viewport;
