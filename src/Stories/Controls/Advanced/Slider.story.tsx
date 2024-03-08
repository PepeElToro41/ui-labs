import React, { useMemo, useState } from "@rbxts/react";
import { createLegacyRoot } from "@rbxts/react-roblox";
import ControlHolder from "UI/StoryControls/ControlHolder";
import SliderControl from "UI/StoryControls/Controls/Advanced/Slider";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { FunctionStory, Slider } from "@rbxts/ui-labs";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return Slider(5, 0, 100, 2);
	}, []);

	const [sliderValue, setSliderValue] = useState(control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, -0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="Slider Control" ControlReset={() => {}}>
				<SliderControl Control={control} Current={sliderValue} Apply={setSliderValue} />
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
