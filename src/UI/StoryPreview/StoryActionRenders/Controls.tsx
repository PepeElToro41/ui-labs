import Immut from "@rbxts/immut";
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "@rbxts/react";
import { ControlGroup } from "@rbxts/ui-labs";
import { ConvertedControlList, ConvertedControls, ObjectControl } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import ControlGroupRender from "UI/StoryControls/ControlGroupRender";
import ControlHolder from "UI/StoryControls/ControlHolder";
import { AllControlMap } from "UI/StoryControls/ControlMap";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";

interface ControlsProps<T extends ParametrizedControls> {
	Controls: ConvertedControls;
	ControlValues: T;
	SetControlValues: Dispatch<SetStateAction<T>>;
}

const TITLE_NAME_WIDTH = 200;

function CreateControlRender<T extends ObjectControl>(control: T, current: T["ControlValue"], apply: (val: T["ControlValue"]) => void) {
	const FactoryElement = AllControlMap[control.Type] as unknown as ControlFactory<T>;
	return <FactoryElement Control={control} Current={current} Apply={apply} />;
}

function RenderControlGroup(
	name: string,
	controlGroup: ControlGroup<ConvertedControlList>,
	groupValues: ParametrizedControls,
	update: (value: ParametrizedControls) => void,
) {
	const controls: ReactChildren = new Map();

	for (const [name, control] of pairs(controlGroup.Controls)) {
		const controlValue = groupValues[name] as ControlValue;

		const renderedControl = RenderControl(name, control, controlValue, (value) => {
			if (control.OnReset) control.OnReset();
			update(
				Immut.produce(groupValues, (draft) => {
					draft[name] = value;
				}),
			);
		});
		controls.set(name, renderedControl);
	}
	return <ControlGroupRender GroupName={name}>{controls}</ControlGroupRender>;
}

function RenderControl(name: string, control: ObjectControl, value: ControlValue, update: (value: ControlValue) => void) {
	const subcomponent: ReactChildren = new Map();
	const controlRender = CreateControlRender(control, value, update);
	subcomponent.set("ControlRender", controlRender);

	const render = (
		<ControlHolder
			ControlName={name}
			ControlReset={() => {
				if (control.OnReset) control.OnReset();
				update(control.ControlValue);
			}}
		>
			{controlRender}
		</ControlHolder>
	);
	return render;
}

function Controls<T extends ParametrizedControls>(props: ControlsProps<T>) {
	const theme = useTheme();

	const SetControlByIndex = useCallback(
		<K extends keyof T>(index: K, value: T[K]) => {
			props.SetControlValues((old) => {
				return Immut.produce(old, (draft) => {
					const setDraft = draft as T;
					setDraft[index] = value;
				});
			});
		},
		[props.SetControlValues],
	);

	const controlComponents = useMemo(() => {
		const components: ReactChildren = new Map();

		for (const [name, control] of pairs(props.Controls)) {
			if (control.EntryType === "ControlGroup") {
				const groupValues = props.ControlValues[name] as ParametrizedControls;
				const render = RenderControlGroup(name, control, groupValues, (values) => {
					SetControlByIndex(name, values as T[keyof T]);
				});
				components.set(name, render);
				continue;
			}

			const controlValue = props.ControlValues[name] as ControlValue;
			const render = RenderControl(name, control, controlValue, (value) => {
				SetControlByIndex(name, value as T[keyof T]);
			});
			components.set(name, render);
		}

		return components;
	}, [props.Controls, props.ControlValues, SetControlByIndex]);

	return (
		<Div key={"ControlsAction"}>
			<Padding PaddingY={3} />
			<Div key={"TopTitle"} Size={new UDim2(1, 0, 0, 27)}>
				<Text
					Size={new UDim2(0, TITLE_NAME_WIDTH, 1, 0)}
					Position={UDim2.fromOffset(10, 0)}
					TextSize={13}
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={"Name"}
				/>
				<Text
					Size={new UDim2(1, -TITLE_NAME_WIDTH, 1, 0)}
					Position={UDim2.fromOffset(TITLE_NAME_WIDTH + 10, 0)}
					TextSize={13}
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={"Control"}
				/>
				<Divisor Direction="X" Anchor={0} Position={UDim2.fromScale(0, 1)} />
			</Div>
			<frame Position={new UDim2(1, -10, 0.5, 0)} AnchorPoint={new Vector2(1, 0.5)} Size={new UDim2(0, 0, 1, -2)}>
				<Corner Radius={6} />
			</frame>
			<scrollingframe
				BackgroundTransparency={1}
				ScrollBarThickness={2}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 1, -28)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={UDim2.fromScale(0, 0)}
				Position={UDim2.fromOffset(0, 28)}
			>
				<TopList Padding={new UDim(0, 3)} />
				{controlComponents}
			</scrollingframe>
		</Div>
	);
}

export default Controls;
