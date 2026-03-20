import React, { InstanceAttributes } from "@rbxts/react";

interface LeftListProps extends InstanceAttributes<UIListLayout> {}

export default (props: LeftListProps) => {
	return (
		<uilistlayout
			key={"LeftList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Left}
			{...props}
		></uilistlayout>
	);
};
