import Roact from "@rbxts/roact";

interface RightListProps extends JSX.IntrinsicElement<UIListLayout> {}

export default (props: RightListProps) => {
	return (
		<uilistlayout
			Key={"RightList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Right}
			{...props}
		></uilistlayout>
	);
};
