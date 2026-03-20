import React from "@rbxts/react";

interface RightListProps extends React.InstanceAttributes<UIListLayout> {}

export default (props: RightListProps) => {
	return (
		<uilistlayout
			key={"RightList"}
			SortOrder={Enum.SortOrder.LayoutOrder}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Right}
			{...props}
		></uilistlayout>
	);
};
