import React, { useCallback, useEffect } from "@rbxts/react";
import { AdvancedTypes } from "@rbxts/ui-labs/src/ControlTypings/Advanced";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import ObjectHolder from "./ObjectHolder";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import Text from "UI/Styles/Text";
import LeftList from "UI/Styles/List/LeftList";
import SelectedObject from "./SelectedObject";

function ObjectControl(props: ControlElementProps<AdvancedTypes.Object<"Instance">>) {
	const theme = useTheme();
	const current = props.Current;

	const OnAssignObject = useCallback(
		(object: Instance) => {
			if (object === current) return;
			if (props.Control.Predicator) {
				const pass = props.Control.Predicator(object);
				if (!pass) {
					return warn(`Instance: ${object} did not pass the predicator`);
				}
			}
			props.Apply(object);
		},
		[props.Control, current, props.Apply],
	);
	const OnClearObject = useCallback(() => {
		props.Apply(undefined);
	}, [props.Apply]);

	useEffect(() => {
		const current = props.Current;
		if (!current) return;

		const connection = current.GetPropertyChangedSignal("Parent").Connect(() => {
			if (current.Parent === undefined) {
				props.Apply(undefined);
			}
		});
		return () => connection.Disconnect();
	}, [current, props.Apply]);

	return (
		<Div>
			<Padding PaddingY={4} />
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 12)} />
			<ObjectHolder Object={props.Current} OnClearObject={OnClearObject} />
			<SelectedObject OnAssignObject={OnAssignObject} CurrentObject={props.Current} ClassName={props.Control.ClassName} />
		</Div>
	);
}

export default ObjectControl;
