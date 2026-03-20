import React, { InstanceAttributes } from "@rbxts/react";

interface BottomListProps extends InstanceAttributes<UIListLayout> {}

export default (props: BottomListProps) => {
	return (
		<uilistlayout
			key={"BottomList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Vertical}
			VerticalAlignment={Enum.VerticalAlignment.Bottom}
			{...props}
		/>
	);
};
