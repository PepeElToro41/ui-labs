import React, { useMemo, useState } from "@rbxts/react";
import { createLegacyRoot } from "@rbxts/react-roblox";
import ControlHolder from "UI/StoryControls/ControlHolder";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { FunctionStory } from "@rbxts/ui-labs";
import { UserInputProvider } from "Context/UserInputContext";
import AppHolder from "UI/AppHolder";
import OverlayControl from "UI/Overlays/OverlayControl";
import { EnumList } from "@rbxts/ui-labs";
import EnumListControl from "UI/StoryControls/Controls/Advanced/OptionList/EnumList";
import { ChooseOptionType } from "@rbxts/ui-labs/src/ControlTypings/Advanced";

function Story(props: {}) {
	const theme = useTheme();
	const control = useMemo(() => {
		return EnumList({ Enum1: 2, Enum2: "Text", Enum3: Color3.fromRGB(255, 80, 255), Enum4: () => {} }, "Enum1");
	}, []);

	const [enumValue, setEnumValue] = useState(() => control.ControlValue);

	return (
		<frame Position={UDim2.fromOffset(0, 0)} Size={new UDim2(1, -0, 1, 0)} BackgroundColor3={theme.ActionsPanel.Color}>
			<Corner Radius={4} />
			<ControlHolder ControlName="EnumList Control" ControlReset={() => {}}>
				<EnumListControl
					Control={control}
					Current={enumValue}
					Apply={(val) => {
						setEnumValue(() => val);
					}}
				/>
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
