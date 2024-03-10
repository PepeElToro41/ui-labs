import React, { useMemo, useState } from "@rbxts/react";
import { createLegacyRoot } from "@rbxts/react-roblox";
import ControlHolder from "UI/StoryControls/ControlHolder";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { FunctionStory, Object } from "@rbxts/ui-labs";
import { UserInputProvider } from "Context/UserInputContext";
import AppHolder from "UI/AppHolder";
import OverlayControl from "UI/Overlays/OverlayControl";
import { EnumList } from "@rbxts/ui-labs";
import EnumListControl from "UI/StoryControls/Controls/Advanced/OptionList/EnumList";
import ObjectControl from "UI/StoryControls/Controls/Advanced/Object";
import { DescriptionProvider } from "Context/DescriptionContext";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return Object("Model" as "Instance"); //Weird lmao
	}, []);

	const [objectValue, setObjectValue] = useState(() => control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="Object Control" ControlReset={() => {}}>
				<ObjectControl Control={control} Current={objectValue} Apply={setObjectValue} />
			</ControlHolder>
		</frame>
	);
}

const story: FunctionStory = (target) => {
	const component = (
		<ReflexProvider producer={RootProducer}>
			<UserInputProvider>
				<DescriptionProvider>
					<AppHolder>
						<Story></Story>
						<OverlayControl />
					</AppHolder>
				</DescriptionProvider>
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
