import { useMountEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useRef } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Viewport(props: StoryHolderProps) {
	const mountRef = useRef<Frame>();
	const storyName = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);

	useDeferLifetime(props, 2);

	useMountEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		props.MountFrame.Parent = holder;
	});

	return createPortal(
		<screengui key={storyName} ZIndexBehavior={props.PreviewEntry.ZIndexBehavior}>
			<Div key={"Holder"} Reference={mountRef}></Div>
		</screengui>,
		game.GetService("CoreGui"),
	);
}

export default Viewport;
