import Roact from "@rbxts/roact";
import { useEffect, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { useProducer } from "@rbxts/roact-reflex";
import { useCanvasControl } from "Hooks/Reflex/Use/Preview";
import { useInstance } from "Hooks/Utils/Instance";
import FrameFill from "UI/Holders/FrameFill";
import { Div } from "UI/Styles/Div";
import CanvasControl from "./CanvasControl";

interface StoryPreviewProps {}

function setProps(props: StoryPreviewProps) {
	return props as Required<StoryPreviewProps>;
}

function StoryPreviewCreate(setprops: StoryPreviewProps) {
	const props = setProps(setprops as Required<StoryPreviewProps>);
	const previewFrame = useInstance("Frame", undefined, {
		BackgroundTransparency: 1,
		Position: new UDim2(0, 0, 0, 0),
		Size: new UDim2(1, 0, 1, 0),
	});
	const panelPreviewRef = useRef<Frame>();
	const viewportPreviewRef = useRef<Frame>();
	const { zoom, offset } = useCanvasControl();

	const { setMountFrame } = useProducer<RootProducer>();
	const [onViewport, setOnViewport] = useState(false);

	useEffect(() => {
		setMountFrame(previewFrame);
	}, []);
	useEffect(() => {
		const panelPreview = panelPreviewRef.getValue();
		const viewportPreview = viewportPreviewRef.getValue();
		if (onViewport) {
			if (!viewportPreview) return;
			previewFrame.Parent = viewportPreview;
		} else {
			if (!panelPreview) return;
			previewFrame.Parent = panelPreview;
		}
	}, [onViewport]);

	return (
		<>
			<FrameFill
				Key="PreviewPanel"
				Size={new UDim2(1, 0, 0, 0)}
				FrameProps={{ LayoutOrder: 2 }}
				AnchorPoint={new Vector2(0, 0)}
				FillDir="Y"
			>
				<Div Key={"PreviewCanvas"} Position={UDim2.fromOffset(offset.X, offset.Y)} Ref={panelPreviewRef}>
					<uiscale Scale={zoom}></uiscale>
				</Div>
				<CanvasControl></CanvasControl>
			</FrameFill>
			<Roact.Portal target={game.GetService("CoreGui")}>
				<screengui Key="UIStory" ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
					<frame
						Key="PreviewFrame"
						BackgroundTransparency={1}
						Size={new UDim2(1, 0, 1, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						Ref={viewportPreviewRef}
					/>
				</screengui>
			</Roact.Portal>
		</>
	);
}
const StoryPreview = withHooks(StoryPreviewCreate);

export = StoryPreview;
