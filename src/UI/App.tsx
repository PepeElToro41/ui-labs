import Roact from "@rbxts/roact";
import { useBinding, useCallback, useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
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

interface AppProps {}

function setProps(props: AppProps) {
	return props as Required<AppProps>;
}

function AppCreate(setprops: AppProps) {
	const props = setProps(setprops);

	controlModuleList();
	controlStorybooks();
	controlNodes();
	controlPreview();

	return (
		<UserInputProvider>
			<AppHolder>
				<Div Key={"Plugin"}>
					<List />
					<TopBar />
					<AppPanel />
				</Div>
				<OverlayControl />
			</AppHolder>
		</UserInputProvider>
	);
}

const App = withHooks(AppCreate);

export = App;
