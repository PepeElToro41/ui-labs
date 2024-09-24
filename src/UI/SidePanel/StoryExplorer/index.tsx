import Vide, { derive, effect } from "@rbxts/vide";
import { Source } from "@rbxts/vide";
import { useStoryNodes } from "Contexts/StoryNodesProvider";
import { useTheme } from "Contexts/ThemeProvider";
import Divisor from "UI/Elements/Divisor";
import Div from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Scroller from "UI/Styles/Scroller";
import Text from "UI/Styles/Text";
import StorybookNodes from "./StorybookNodes";
import UnknownNodes from "./UnknownNodes";
import { FilterNodes } from "./Filtering";

interface StoryExplorerProps {
	Filter: Source<string | undefined>;
}

function StoryExplorer(props: StoryExplorerProps) {
	const theme = useTheme();
	const nodes = useStoryNodes();

	effect(() => print(nodes()));

	const displayNodes = derive(() => {
		const filter = props.Filter();
		if (filter === undefined) return nodes();

		return FilterNodes(nodes(), filter);
	});

	return (
		<Div Name={"StoryExplorer"} Size={new UDim2(1, 0, 0, 0)}>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<TopList Gap={6} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			<Text
				Text="Story Explorer"
				TextSize={14}
				Size={new UDim2(1, 0, 0, 25)}
				TextColor3={theme("Text")}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<Padding PaddingX={4} />
			</Text>
			<Divisor Direction="X" Size={new UDim(1, -10)} />
			<Scroller Size={new UDim2(1, 6, 0, 0)}>
				<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
				<TopList Gap={1} />
				<StorybookNodes Nodes={() => displayNodes().Storybooks} />
				<UnknownNodes Nodes={() => displayNodes().Unknown} />
			</Scroller>
		</Div>
	);
}

export default StoryExplorer;
