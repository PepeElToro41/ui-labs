import Vide, { InstanceAttributes } from "@rbxts/vide";
import List from ".";

interface RightListProps extends InstanceAttributes<UIListLayout> {
	Gap?: number;
}

export default (props: RightListProps) => {
	return (
		<List
			Name={"RightList"}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Right}
			{...props}
		/>
	);
};
