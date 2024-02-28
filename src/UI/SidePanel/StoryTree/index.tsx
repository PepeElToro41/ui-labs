import Roact, { useMemo } from "@rbxts/roact";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import { useSelector } from "@rbxts/react-reflex";
import { FilterNodes } from "./SearchFilter";
import Unknown from "../Nodes/ChildrenHolder/Unknown";
import { selectNodes } from "Reflex/Explorer/Nodes";
import { selectFilter } from "Reflex/Explorer/Filter";
import Storybook from "../Nodes/ChildrenHolder/Storybook";
import { selectOverlay } from "Reflex/Overlay";

interface StoryTreeProps {}

function StoryTree(props: StoryTreeProps) {
	const nodes = useSelector(selectNodes).nodes;
	const filter = useSelector(selectFilter).search;
	const overlay = useSelector(selectOverlay);
	const isBlocked = overlay !== undefined;

	const nodeList = useMemo(() => {
		const filteredNodes = filter === undefined ? nodes : FilterNodes(nodes, filter);
		const elementsList: Roact.Element[] = [];
		const booksSize = filteredNodes.storybooks.size();
		filteredNodes.storybooks.forEach((node, index) => {
			elementsList.push(<Storybook Order={index} Node={node} />);
		});
		filteredNodes.unknown.forEach((node, index) => {
			elementsList.push(<Unknown Order={booksSize + index} Node={node} />);
		});
		return elementsList;
	}, [nodes, filter]);

	return (
		<Detector Key="ScrollerFrame" Size={new UDim2(1, 0, 1, -65)} AnchorPoint={new Vector2(0.5, 0)} LayoutOrder={3}>
			<scrollingframe
				Key={"Scroller"}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={new UDim2()}
				ScrollBarThickness={2}
				ScrollBarImageTransparency={0.8}
				Active={true}
				BorderSizePixel={0}
				ScrollingEnabled={!isBlocked}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 1)} />
				{nodeList}
			</scrollingframe>
		</Detector>
	);
}

export default StoryTree;
