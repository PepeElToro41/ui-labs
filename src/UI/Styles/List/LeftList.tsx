import Roact from "@rbxts/roact";

interface LeftListProps extends JSX.IntrinsicElement<UIListLayout> {}

export = (props: LeftListProps) => {
	return (
		<uilistlayout
			Key={"LeftList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Left}
			{...props}
		></uilistlayout>
	);
};
