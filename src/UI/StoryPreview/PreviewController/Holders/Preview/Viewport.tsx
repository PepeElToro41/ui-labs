import { useMountEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useRef } from "@rbxts/roact";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Viewport(props: StoryHolderProps) {
	const mountRef = useRef<Frame>();
	const storyName = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);

	useDeferLifetime(props);

	useMountEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		props.MountFrame.Parent = holder;
	});

	return (
		<Roact.Portal target={game.GetService("CoreGui")}>
			<screengui Key={storyName} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
				<Div Key={"Holder"} Reference={mountRef}></Div>
			</screengui>
		</Roact.Portal>
	);
}

export default Viewport;
