import Vide from "@rbxts/vide";
import { Derived } from "Utils/Vide";
import ChildrenHolder from ".";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Image from "UI/Styles/Image";
import ChildrenRenderer from "./ChildrenRenderer";
import Story from "../Story";

interface FolderProps {
	Node: Derived<FolderNode>;
	Index?: Derived<number>;
	IsChild?: boolean;
}

function Folder(props: FolderProps) {
	const theme = useTheme();
	const name = () => props.Node().Instance;

	return (
		<ChildrenHolder
			Name={name}
			Icon={<Image Size={UDim2.fromOffset(13, 13)} Image={Images.Folder} ImageColor3={theme("Folder")} LayoutOrder={-1} />}
			IsChild={props.IsChild}
			LayoutOrder={props.Index}
		>
			{ChildrenRenderer({ Renderers: { Folder: Folder, Story: Story }, Container: props.Node })}
		</ChildrenHolder>
	);
}

export default Folder;
