import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Div from "./Styles/Div";
import TopBar from "./Topbar";
import AppPanel from "./AppPanel";
import List from "./Styles/List";
import { controlModuleList } from "Hooks/Reflex/Control/ModuleList";
import { controlModuleRequire } from "Hooks/Reflex/Control/ModuleRequire";
import { controlNodes } from "Hooks/Reflex/Control/Nodes";

interface AppProps {}

function setProps(props: AppProps) {
	return props as Required<AppProps>;
}

function AppCreate(setprops: AppProps) {
	const props = setProps(setprops);

	controlModuleList();
	controlModuleRequire();
	controlNodes();

	return (
		<Div Key="App">
			<List />
			<TopBar />
			<AppPanel />
		</Div>
	);
}

const App = withHooks(AppCreate);

export = App;
