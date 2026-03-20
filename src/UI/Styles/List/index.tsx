import React from "@rbxts/react";

interface ListProps extends React.InstanceAttributes<UIListLayout> {}

export default (props: ListProps) => {
	return <uilistlayout key={"List"} SortOrder={Enum.SortOrder.LayoutOrder} {...props}></uilistlayout>;
};
