import Roact from "@rbxts/roact";
import { useMemo, useRef, withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { selectStoryPreviews } from "Reflex/StoryPreview/StoryMount";
import { Div } from "UI/Styles/Div";
import PreviewController from "./PreviewController";

interface PreviewControlProps {}

function setProps(props: PreviewControlProps) {
	return props as Required<PreviewControlProps>;
}

function PreviewControlCreate(setprops: PreviewControlProps) {
	const props = setProps(setprops as Required<PreviewControlProps>);
	const previews = useSelector(selectStoryPreviews);
	const storiesFrame = useRef<Frame>();

	const controllers = useMemo(() => {
		const children: Roact.Children = new Map();
		const frame = storiesFrame.getValue();
		if (!frame) return children;

		previews.forEach((entry, uid) => {
			children.set(uid, <PreviewController PreviewEntry={entry} StoriesFrame={frame} />);
		});

		return children;
	}, [previews, storiesFrame]);

	return (
		<Div Key={"Stories"} Size={new UDim2(1, 0, 1, -31)} Ref={storiesFrame}>
			{controllers}
		</Div>
	);
}
const PreviewControl = withHooks(PreviewControlCreate);

export = PreviewControl;
