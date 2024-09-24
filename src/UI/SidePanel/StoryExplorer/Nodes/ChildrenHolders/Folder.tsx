import Vide, { Derivable, match, untrack } from "@rbxts/vide";
import { Derived } from "Utils/Vide";
import ChildrenHolder from ".";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Image from "UI/Styles/Image";
import Story from "../Story";
import { array_keys } from "Utils/Vide/ControlFlow";

interface ChildrenRendererProps {
	Container: Derived<ContainerNode>;
}

export function ChildrenRenderer(props: ChildrenRendererProps) {
	const children = () => props.Container().Children;

	return array_keys(children, "Identifier", (node, key, index) => {
		return untrack(
			match(() => node().Type)({
				Story: () => <Story Story={node as Derived<StoryNode>} IsChild={true} LayoutOrder={index} />,
				Folder: () => <Folder Folder={node as Derived<FolderNode>} IsChild={true} LayoutOrder={index} />,
			}),
		);
	});
}

interface FolderProps {
	Folder: Derived<FolderNode>;
	LayoutOrder?: Derivable<number>;
	IsChild?: boolean;
}

function Folder(props: FolderProps) {
	const theme = useTheme();
	const name = () => props.Folder().Instance;

	return (
		<ChildrenHolder
			Name={name}
			Icon={<Image Size={UDim2.fromOffset(13, 13)} Image={Images.Folder} ImageColor3={theme("Folder")} LayoutOrder={-1} />}
			IsChild={props.IsChild}
			LayoutOrder={props.LayoutOrder}
		>
			{ChildrenRenderer({ Container: props.Folder })}
		</ChildrenHolder>
	);
}

export default Folder;
