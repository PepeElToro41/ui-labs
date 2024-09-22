import Vide, { InstanceAttributes } from "@rbxts/vide";
import List from ".";

interface TopListProps extends InstanceAttributes<UIListLayout> {
	Gap?: number;
}

export default (props: TopListProps) => {
	return (
		<List
			Name={"TopList"}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Top}
			{...props}
		/>
	);
};
