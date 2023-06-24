import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface StoryPreviewProps {}

function setProps(props: StoryPreviewProps) {
	return props;
}

function StoryPreviewCreate(setprops: StoryPreviewProps) {
	const props = identity<Required<StoryPreviewProps>>(setProps(setprops) as Required<StoryPreviewProps>);
	return (
		<frame
			Key="Preview"
			BackgroundTransparency={1}
			Size={new UDim2(1, -25, 1, 0)}
			Position={new UDim2(0, 40, 0, 0)}
		></frame>
	);
}
const StoryPreview = withHooks(StoryPreviewCreate);

export = StoryPreview;
