import Vide, { Derivable } from "@rbxts/vide";
import { Derived } from "Utils/Vide";
import ChildrenHolder from ".";
import Image from "UI/Styles/Image";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import { ChildrenRenderer } from "./Folder";

interface StorybookProps {
	Storybook: Derived<StorybookNode>;
	LayoutOrder?: Derivable<number>;
}

export function Storybook(props: StorybookProps) {
	const theme = useTheme();
	const name = () => props.Storybook().Name;

	return (
		<ChildrenHolder
			Name={name}
			Icon={<Image Size={UDim2.fromOffset(13, 13)} Image={Images.Storybook} ImageColor3={theme("Storybook")} LayoutOrder={-1} />}
		>
			{ChildrenRenderer({ Container: props.Storybook })}
		</ChildrenHolder>
	);
}
