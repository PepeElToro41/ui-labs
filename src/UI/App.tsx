import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { DescriptionProvider } from "Context/DescriptionContext";
import { ToolsProvider } from "Context/ToolsContext";
import { UserInputProvider } from "Context/UserInputContext";
import { controlNodes } from "Hooks/Reflex/Control/Explorer";
import { controlModuleList } from "Hooks/Reflex/Control/ModuleList";
import { controlStorybooks } from "Hooks/Reflex/Control/ModuleRequire/Storybooks";
import { controlPluginSettings } from "Hooks/Reflex/Control/PluginSettings";
import { controlPreview } from "Hooks/Reflex/Control/Preview";
import { selectPopup } from "Reflex/Overlay";
import AppHolder from "./AppHolder";
import OverlayControl from "./Overlays/OverlayControl";
import SidePanel from "./SidePanel";
import StoryPanel from "./StoryPanel";
import { Div } from "./Styles/Div";
import LeftList from "./Styles/List/LeftList";
import ProviderStack from "./Utils/ProviderStack";

interface AppProps {}

function App(props: AppProps) {
	controlPluginSettings();
	controlModuleList();
	controlStorybooks();
	controlNodes();
	controlPreview();

	const popup = useSelector(selectPopup);

	return (
		<ProviderStack
			Providers={[UserInputProvider, DescriptionProvider, ToolsProvider]}
		>
			<AppHolder>
				<Div key={"Plugin"} Interactable={popup === undefined}>
					<LeftList />
					<SidePanel />
					<StoryPanel />
				</Div>
				<OverlayControl />
			</AppHolder>
		</ProviderStack>
	);
}

export default App;
