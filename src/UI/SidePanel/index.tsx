import Vide, { source } from "@rbxts/vide";
import { useTheme } from "Contexts/ThemeProvider";
import Frame from "UI/Styles/Frame";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Branding from "./Branding";
import StorySearch from "./StorySearch";
import StoryExplorer from "./StoryExplorer";

function SidePanel() {
	const theme = useTheme();
	const filter = source<string>();

	return (
		<Frame Name={"SidePanel"} BackgroundColor3={theme("Background2")} ClipsDescendants={true}>
			<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Gap={8} />
			<Padding PaddingY={6} PaddingX={10} />
			<Branding />
			<StorySearch OnInputChanged={(text) => filter(text === "" ? undefined : text)} />
			<StoryExplorer Filter={filter} />
		</Frame>
	);
}

export default SidePanel;
