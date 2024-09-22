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
import { useSelector } from "@rbxts/react-reflex";
import { selectPopup } from "Reflex/Overlay";

interface AppProps {}

function App(props: AppProps) {
	controlModuleList();
	controlStorybooks();
	controlNodes();
	controlPreview();

	const popup = useSelector(selectPopup);

	return (
		<ProviderStack Providers={[UserInputProvider, DescriptionProvider, ToolsProvider]}>
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
