import React, { useMemo, useState } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createLegacyRoot } from "@rbxts/react-roblox";
import { Boolean, FunctionStory, Primitive } from "@rbxts/ui-labs";
import { UserInputProvider } from "Context/UserInputContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { RootProducer } from "Reflex";
import AppHolder from "UI/AppHolder";
import ControlHolder from "UI/StoryControls/ControlHolder";
import BooleanControl from "UI/StoryControls/Controls/Primitives/Boolean";
import Corner from "UI/Styles/Corner";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return Boolean(true);
	}, []);

	const [booleanValue, setBooleanValue] = useState(control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, -0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="Boolean Control" ControlReset={() => {}}>
				<BooleanControl Control={control} Current={booleanValue} Apply={setBooleanValue} />
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
