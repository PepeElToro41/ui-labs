import Roact from "@rbxts/roact";
import { useContext, useEffect, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { StoryContext } from "UI/Contexts/StoryContext";
import CreateFolder from "UI/Side/StoryNodes/StoryFolder";

interface StoryTreeProps {
	Filter: string | undefined;
	Folders: FolderNode[];
}

function setProps(props: StoryTreeProps) {
	return props;
}

function StoryTreeCreate(setprops: StoryTreeProps) {
	const props = identity<Required<StoryTreeProps>>(setProps(setprops) as Required<StoryTreeProps>);
	const storyContext = useContext(StoryContext);
	useEffect(() => {
		storyContext.updateDisplayNode(props.Folders as FolderNode[]);
	}, [props.Folders]);

	const folderElements = useMemo(() => {
		const allElements: Roact.Element[] = [];
		props.Folders.forEach((folder, index) => {
			const NewFolder = CreateFolder({
				Key: folder.DisplayName,
				DisplayName: folder.DisplayName,
				LayoutOrder: index,
				Unknown: folder.Unknown ?? false,
				Filter: props.Filter,
				DisplayedNode: storyContext.displayedNode,
				DisplayNode: storyContext.displayNode,
				Inside: folder.Inside ?? [],
			});
			if (NewFolder) allElements.push(NewFolder);
		});
		return allElements;
	}, [props.Folders, props.Filter, storyContext.displayedNode]);
	return (
		<textbutton
			Key="ScrollerFrame"
			Size={new UDim2(1, 0, 1, -65)}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			TextTransparency={1}
			LayoutOrder={3}
		>
			<scrollingframe
				Key="Scroller"
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(0, 0, 0, 0)}
				ScrollBarThickness={3}
				Size={UDim2.fromScale(1, 1)}
			>
				<uipadding PaddingRight={new UDim(0, 3)} />
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
				{folderElements}
			</scrollingframe>
		</textbutton>
	);
}
const StoryTree = withHooks(StoryTreeCreate);

export = StoryTree;
