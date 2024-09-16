import React from "@rbxts/react";
import { Div } from "./Styles/Div";
import { controlModuleList } from "Hooks/Reflex/Control/ModuleList";
import { controlNodes } from "Hooks/Reflex/Control/Explorer";
import OverlayControl from "./Overlays/OverlayControl";
import { UserInputProvider } from "Context/UserInputContext";
import { controlPreview } from "Hooks/Reflex/Control/Preview";
import { controlStorybooks } from "Hooks/Reflex/Control/ModuleRequire/Storybooks";
import AppHolder from "./AppHolder";
import { DescriptionProvider } from "Context/DescriptionContext";
import { ToolsProvider } from "Context/ToolsContext";
import ProviderStack from "./Utils/ProviderStack";
import LeftList from "./Styles/List/LeftList";
import SidePanel from "./SidePanel";
import StoryPanel from "./StoryPanel";

interface AppProps {}

function App(props: AppProps) {
	controlModuleList();
	controlStorybooks();
	controlNodes();
	controlPreview();

	return (
		<ProviderStack Providers={[UserInputProvider, DescriptionProvider, ToolsProvider]}>
			<AppHolder>
				<Div key={"Plugin"}>
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
