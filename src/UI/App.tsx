import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Div from "./Styles/Div";
import TopBar from "./Topbar";
import AppPanel from "./AppPanel";
import List from "./Styles/List";

interface AppProps {}

function setProps(props: AppProps) {
	return props as Required<AppProps>;
}

function App(setprops: AppProps) {
	const props = setProps(setprops);
	return (
		<Div Key="App">
			<List></List>
			<TopBar></TopBar>
			<AppPanel></AppPanel>
		</Div>
	);
}

export = App;
