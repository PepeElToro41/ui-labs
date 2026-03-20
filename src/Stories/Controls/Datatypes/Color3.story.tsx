import React, { useMemo, useState } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createLegacyRoot } from "@rbxts/react-roblox";
import { Datatype, FunctionStory } from "@rbxts/ui-labs";
import { UserInputProvider } from "Context/UserInputContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { RootProducer } from "Reflex";
import AppHolder from "UI/AppHolder";
import OverlayControl from "UI/Overlays/OverlayControl";
import ControlHolder from "UI/StoryControls/ControlHolder";
import SliderControl from "UI/StoryControls/Controls/Advanced/Slider";
import Color3Control from "UI/StoryControls/Controls/Datatypes/Color3";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return Datatype.Color3(Color3.fromRGB(255, 112, 255));
	}, []);

	const [colorValue, setColorValue] = useState(control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, -0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="Color3 Control" ControlReset={() => {}}>
				<Color3Control Control={control} Current={colorValue} Apply={setColorValue} />
			</ControlHolder>
		</frame>
	);
}

const story: FunctionStory = (target) => {
	const component = (
		<ReflexProvider producer={RootProducer}>
			<UserInputProvider>
				<AppHolder>
					<Story></Story>
					<OverlayControl />
				</AppHolder>
			</UserInputProvider>
		</ReflexProvider>
	);
	const root = createLegacyRoot(target);
	root.render(component);
	return () => {
		root.unmount();
	};
};
export = story;
