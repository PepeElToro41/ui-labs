import React, { Binding, useEffect } from "@rbxts/react";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";

import FollowComponent from "../Utils/FollowComponent";
import { MIN_SIZE } from "./Utils";

interface OutlinerProps {
	Component: GuiObject;
	Inset: Binding<Vector2>;
	OnImportantChange: () => void;
}

type OutlineColors = Partial<Record<keyof Instances, Color3>>;

const OUTLINE_COLORS: OutlineColors = {
	Frame: Color3.fromRGB(218, 131, 1),
	TextLabel: Color3.fromRGB(3, 108, 219),
	ImageLabel: Color3.fromRGB(18, 232, 18),
	ImageButton: Color3.fromRGB(18, 232, 18),
	TextButton: Color3.fromRGB(3, 108, 219),
	ScrollingFrame: Color3.fromRGB(242, 33, 33)
};

function Outliner(props: OutlinerProps) {
	const color = OUTLINE_COLORS[props.Component.ClassName as keyof Instances] ?? Color3.fromRGB(218, 131, 1);

	useEffect(() => {
		let called = false;

		const Call = () => {
			if (called) return;
			called = true;
			props.OnImportantChange();
		};

		const visible = props.Component.GetPropertyChangedSignal("Visible").Connect(() => {
			if (!props.Component.Visible) {
				Call();
			}
		});
		const absoluteSize = props.Component.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			if (props.Component.AbsoluteSize.X < MIN_SIZE || props.Component.AbsoluteSize.Y < MIN_SIZE) {
				Call();
			}
		});

		return () => {
			visible.Disconnect();
			absoluteSize.Disconnect();
		};
	}, [props.Component]);

	return (
		<FollowComponent Component={props.Component} Inset={props.Inset}>
			<Padding Padding={1} />
			<Div>
				<Corner Radius={2} />
				<uistroke Color={color} Thickness={1} />
			</Div>
		</FollowComponent>
	);
}

export default Outliner;
