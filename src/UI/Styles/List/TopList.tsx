import React, { InstanceChangeEvent } from "@rbxts/react";

interface TopListProps extends React.InstanceAttributes<UIListLayout> {
	Change?: InstanceChangeEvent<UIListLayout>;
}

export default (props: TopListProps) => {
	return (
		<uilistlayout
			key={"TopList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Top}
			{...props}
		></uilistlayout>
	);
};
