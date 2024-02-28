import { useMountEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useRef } from "@rbxts/roact";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Editor(props: StoryHolderProps) {
	const mountRef = useRef<Frame>();

	const offset = props.PreviewEntry.Offset;
	const scale = props.PreviewEntry.Zoom;
	const storyName = RemoveExtension(props.PreviewEntry.Module.Name, Configs.Extensions.Story);
	const onViewport = props.PreviewEntry.OnViewport;

	useDeferLifetime(props);

	useEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		if (onViewport) return;
		props.MountFrame.Parent = holder;
	}, [mountRef, onViewport]);

	return (
		<Div key={storyName} Position={UDim2.fromOffset(offset.X, offset.Y)} ZIndex={props.PreviewEntry.Order}>
			<uiscale Scale={scale / 100} />
			<Div key={"Story"} Reference={mountRef} />
		</Div>
	);
}

export default Editor;
