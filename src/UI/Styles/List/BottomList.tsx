import Vide, { Derivable, InstanceAttributes } from "@rbxts/vide";
import List from ".";

interface BottomListProps extends InstanceAttributes<UIListLayout> {
	Gap?: Derivable<number>;
}

export default (props: BottomListProps) => {
	return (
		<List
			Name={"BottomList"}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Bottom}
			{...props}
		/>
	);
};
