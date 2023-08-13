import Roact from "@rbxts/roact";

interface BottomListProps extends JSX.IntrinsicElement<UIListLayout> {}

export = (props: BottomListProps) => {
	return (
		<uilistlayout
			Key={"BottomList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Bottom}
			{...props}
		/>
	);
};
