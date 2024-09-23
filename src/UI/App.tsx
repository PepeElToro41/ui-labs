import Vide, { ProviderStack } from "@rbxts/vide";
import UILabs from "./UILabs";
import ModuleSearchProvider from "Contexts/ModuleSearchProvider";
import StorybooksProvider from "Contexts/StorybooksProvider";
import StoryNodesProvider from "Contexts/StoryNodesProvider";
import AppRenderProvider from "Contexts/AppRenderProvider";
import ThemeProvider from "Contexts/ThemeProvider";

function App() {
	return (
		<ProviderStack providers={[ModuleSearchProvider, StorybooksProvider, StoryNodesProvider, ThemeProvider, AppRenderProvider]}>
			{UILabs}
		</ProviderStack>
	);
}

export default App;
