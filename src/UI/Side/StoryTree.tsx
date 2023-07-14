import Roact from "@rbxts/roact";
import { useContext, useEffect, useMemo, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { StoryContext } from "UI/Contexts/StoryContext";
import CreateFolder from "UI/Side/StoryNodes/StoryFolder";
import { Detector } from "UI/UIUtils/Styles/Detector";
import UnknownDivisor from "./StoryNodes/UnknownDivisor";

interface StoryTreeProps {
	Filter: string | undefined;
	Folders: MainNodes;
}

function setProps(props: StoryTreeProps) {
	return props;
}

function StoryTreeCreate(setprops: StoryTreeProps) {
	const props = identity<Required<StoryTreeProps>>(setProps(setprops) as Required<StoryTreeProps>);
	const storyContext = useContext(StoryContext);
	useEffect(() => {
		storyContext.updateDisplayNode(props.Folders);
	}, [props.Folders]);
	const CreateNode = (folder: BookNode | FolderNode, index: number) => {
		const NewFolder = CreateFolder({
			Key: folder.DisplayName,
			DisplayName:
				"InstanceBinded" in folder && typeIs(folder.InstanceBinded, "Instance")
					? folder.InstanceBinded
					: folder.DisplayName,
			LayoutOrder: index,
			Unknown: ("Unknown" in folder && folder.Unknown) ?? false,
			Filter: props.Filter,
			IsBook: "ModuleBookBinded" in folder,
			DisplayedNode: storyContext.displayedNode,
			DisplayNode: storyContext.displayNode,
			Inside: folder.Inside ?? [],
		});
		return NewFolder;
	};
	const folderElements = useMemo(() => {
		const allElements: Roact.Element[] = [];
		const unknownList: FolderNode[] = [];
		let index = 0;
		props.Folders.forEach((folder) => {
			if ("Unknown" in folder && folder.Unknown) {
				unknownList.push(folder);
				return;
			}
			const NewFolder = CreateNode(folder, index);
			if (NewFolder) allElements.push(NewFolder);
			index++;
		});
		if (unknownList.size() > 0) {
			const pushTo = index;
			let added = 0;
			index++;
			unknownList.forEach((folder) => {
				const NewFolder = CreateNode(folder, index);
				if (NewFolder) {
					allElements.push(NewFolder);
					added++;
				}
				index++;
			});
			if (added > 0) {
				allElements.push(<UnknownDivisor LayoutOrder={pushTo}></UnknownDivisor>);
			}
		}
		return allElements;
	}, [props.Folders, props.Filter, storyContext.displayedNode]);
	return (
		<Detector Key="ScrollerFrame" Size={new UDim2(1, 0, 1, -65)} AnchorPoint={new Vector2(0.5, 0)} LayoutOrder={3}>
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
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
				{folderElements}
			</scrollingframe>
		</Detector>
	);
}
const StoryTree = withHooks(StoryTreeCreate);

export = StoryTree;
