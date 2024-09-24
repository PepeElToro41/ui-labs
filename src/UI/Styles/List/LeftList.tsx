import Vide, { Derivable, InstanceAttributes } from "@rbxts/vide";
import List from ".";

interface LeftListProps extends InstanceAttributes<UIListLayout> {
	Gap?: Derivable<number>;
}

export default (props: LeftListProps) => {
	return (
		<List
			Name={"LeftList"}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Left}
			{...props}
		/>
	);
};
