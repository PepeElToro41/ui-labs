import Vide from "@rbxts/vide";

interface ListProps extends Vide.InstanceAttributes<UIListLayout> {
	Gap?: number;
}

export default (props: ListProps) => {
	const gap = props.Gap;
	props.Gap = undefined;

	return (
		<uilistlayout
			Name={"List"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			Padding={gap !== undefined ? new UDim(0, gap) : undefined}
			{...props}
		/>
	);
};
