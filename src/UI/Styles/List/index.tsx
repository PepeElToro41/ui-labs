import Roact from "@rbxts/roact";

interface ListProps extends JSX.IntrinsicElement<UIListLayout> {}

export = (props: ListProps) => {
	return <uilistlayout Key={"List"} SortOrder={Enum.SortOrder.LayoutOrder} {...props}></uilistlayout>;
};
