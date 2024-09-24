import Vide, { Derivable } from "@rbxts/vide";
import { ExtractProp } from "Utils/Vide";

interface ListProps extends Vide.InstanceAttributes<UIListLayout> {
	Gap?: Derivable<number>;
}

export default (props: ListProps) => {
	const gap = ExtractProp(props, "Gap");

	const gapDerive = () => {
		if (gap === undefined) {
			return new UDim(0, 0);
		}
		return new UDim(0, Vide.read(gap));
	};

	return <uilistlayout Name={"List"} SortOrder={Enum.SortOrder.LayoutOrder} Padding={gapDerive} {...props} />;
};
