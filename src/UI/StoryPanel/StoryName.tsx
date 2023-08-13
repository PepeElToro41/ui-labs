import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Divisor from "UI/Utils/Divisor";

interface StoryNameProps {}

function setProps(props: StoryNameProps) {
	return props as Required<StoryNameProps>;
}

function StoryNameCreate(setprops: StoryNameProps) {
	const props = setProps(setprops as Required<StoryNameProps>);
	return (
		<frame Key="StoryName" BackgroundColor3={Color3.fromRGB(39, 39, 39)} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 30)}>
			<Divisor Size={new UDim(1, 0)} Position={UDim2.fromScale(0.5, 1)}></Divisor>
		</frame>
	);
}
const StoryName = withHooks(StoryNameCreate);

export = StoryName;
