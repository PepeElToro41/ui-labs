import React, { useEffect } from "@rbxts/react";
import { Div } from "./Styles/Div";
import TopBar from "./Topbar";
import AppPanel from "./AppPanel";
import List from "./Styles/List";
import { controlModuleList } from "Hooks/Reflex/Control/ModuleList";
import { controlNodes } from "Hooks/Reflex/Control/Explorer";
import OverlayControl from "./Overlays/OverlayControl";
import { UserInputProvider } from "Context/UserInputContext";
import { controlPreview } from "Hooks/Reflex/Control/Preview";
import { controlStorybooks } from "Hooks/Reflex/Control/ModuleRequire/Storybooks";
import AppHolder from "./AppHolder";
import { DescriptionProvider } from "Context/DescriptionContext";

interface AppProps {}

function App(props: AppProps) {
	controlModuleList();
	controlStorybooks();
	controlNodes();
	controlPreview();

	return (
		<UserInputProvider>
			<DescriptionProvider>
				<AppHolder>
					<Div key={"Plugin"}>
						<List />
						<TopBar />
						<AppPanel />
					</Div>
					<OverlayControl />
				</AppHolder>
			</DescriptionProvider>
		</UserInputProvider>
	);
}

export default App;
