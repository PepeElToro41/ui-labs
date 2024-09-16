import React, { Binding, PropsWithChildren } from "@rbxts/react";
import { useShapeInfo, VectorToUDim2 } from ".";
import { Div } from "UI/Styles/Div";
import { composeBindings } from "@rbxts/pretty-react-hooks";

interface FollowComponentProps extends PropsWithChildren {
	Component: GuiObject;
	Inset?: Binding<Vector2>;
}

function FollowComponent(props: FollowComponentProps) {
	const [position, size] = useShapeInfo(props.Component);

	const apply = props.Inset
		? composeBindings(position, props.Inset, (pos, inset) => {
				return pos.sub(inset);
			})
		: position;

	return (
		<Div Position={VectorToUDim2(apply)} Size={VectorToUDim2(size)}>
			{props["children"]}
		</Div>
	);
}

export default FollowComponent;
