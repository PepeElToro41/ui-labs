import Roact, { useMemo, useState } from "@rbxts/roact";
import { createLegacyRoot } from "@rbxts/react-roblox";
import ControlHolder from "UI/StoryControls/ControlHolder";
import SliderControl from "UI/StoryControls/Controls/Advanced/Slider";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { Datatype, FunctionStory } from "@rbxts/ui-labs";
import Vector3Control from "UI/StoryControls/Controls/Datatypes/Vectors/Vector3";
import Padding from "UI/Styles/Padding";
import Vector2Control from "UI/StoryControls/Controls/Datatypes/Vectors/Vector2";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return Datatype.Vector2(new Vector2(10, 0));
	}, []);

	const [vectorValue, setVectorValue] = useState(control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, -0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="Vector2 Control" ControlReset={() => {}}>
				<Vector2Control Control={control} Current={vectorValue} Apply={setVectorValue} />
			</ControlHolder>
		</frame>
	);
}

const story: FunctionStory = (target) => {
	const component = (
		<ReflexProvider producer={RootProducer}>
			<Story></Story>
		</ReflexProvider>
	);
	const root = createLegacyRoot(target);
	root.render(component);
	return () => {
		root.unmount();
	};
};
export = story;
