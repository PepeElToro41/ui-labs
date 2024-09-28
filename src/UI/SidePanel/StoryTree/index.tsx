import React, { useMemo } from "@rbxts/react";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import { useSelector } from "@rbxts/react-reflex";
import { FilterNodes } from "./SearchFilter";
import { selectNodes } from "Reflex/Explorer/Nodes";
import { selectFilter } from "Reflex/Explorer/Filter";
import Storybook from "../Nodes/ChildrenHolder/Storybook";
import { selectPopup } from "Reflex/Overlay";
import UnknownNode from "../Nodes/ChildrenHolder/UnknownNode";
import Divisor from "UI/Utils/Divisor";
import { Div } from "UI/Styles/Div";

interface StoryTreeProps {}

function StoryTree(props: StoryTreeProps) {
	const nodes = useSelector(selectNodes).nodes;
	const filter = useSelector(selectFilter).search;
	const overlay = useSelector(selectPopup);
	const isBlocked = overlay !== undefined;

	const nodeList = useMemo(() => {
		const filteredNodes = filter === undefined ? nodes : FilterNodes(nodes, filter);
		const elementsList: React.Element[] = [];
		const booksSize = filteredNodes.storybooks.size();
		const unknownSize = filteredNodes.unknown.size();

		if (booksSize > 0) {
			filteredNodes.storybooks.forEach((node, index) => {
				elementsList.push(<Storybook Order={index} Node={node} />);
			});
			if (unknownSize > 0) {
				elementsList.push(
					<Div Size={new UDim2(1, 0, 0, 8)} LayoutOrder={booksSize}>
						<Divisor Direction="X" Size={new UDim(1, -25)} Transparency={0.9} />
					</Div>,
				);
			}
		}
		if (filteredNodes.unknown.size() > 0) {
			elementsList.push(<UnknownNode Order={booksSize + 1} UnknownNodes={filteredNodes.unknown} />);
		}
		return elementsList;
	}, [nodes, filter]);

	return (
		<Detector key="ScrollerFrame" Size={new UDim2(1, 0, 1, 0)} AnchorPoint={new Vector2(0.5, 0)} LayoutOrder={3}>
			<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
			<scrollingframe
				key={"Scroller"}
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
				Size={new UDim2(1, 6, 1, 0)}
			>
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 1)} />
				{nodeList}
			</scrollingframe>
		</Detector>
	);
}

export default StoryTree;
