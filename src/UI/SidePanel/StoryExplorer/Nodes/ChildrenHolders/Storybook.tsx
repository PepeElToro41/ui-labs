import Vide, { Derivable } from "@rbxts/vide";
import { Derived } from "Utils/Vide";
import ChildrenHolder from ".";
import Image from "UI/Styles/Image";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import ChildrenRenderer from "./ChildrenRenderer";
import Folder from "./Folder";
import Story from "../Story";
interface StorybookProps {
	Node: Derived<StorybookNode>;
	LayoutOrder?: Derivable<number>;
}

export function Storybook(props: StorybookProps) {
	const theme = useTheme();
	const name = () => props.Node().Name;

	return (
		<ChildrenHolder
			Name={name}
			Icon={<Image Size={UDim2.fromOffset(13, 13)} Image={Images.Storybook} ImageColor3={theme("Storybook")} LayoutOrder={-1} />}
		>
			{ChildrenRenderer({ Renderers: { Folder: Folder, Story: Story }, Container: props.Node })}
		</ChildrenHolder>
	);
}
