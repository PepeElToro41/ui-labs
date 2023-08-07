import Roact from "@rbxts/roact";

interface TopListProps extends JSX.IntrinsicElement<UIListLayout> {}

export = (props: TopListProps) => {
	return (
		<uilistlayout
			Key={"TopList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Top}
			{...props}
		></uilistlayout>
	);
};
