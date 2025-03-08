import Immut from "@rbxts/immut";
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo
} from "@rbxts/react";
import {
	useProducer,
	useSelector,
	useSelectorCreator
} from "@rbxts/react-reflex";
import { ControlGroup } from "@rbxts/ui-labs";
import {
	ConvertedControlList,
	ConvertedControls,
	ObjectControl
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { selectSortMode, SortMode } from "Reflex/PluginSettings";
import { selectPreview } from "Reflex/StoryPreview";
import ControlGroupRender from "UI/StoryControls/ControlGroupRender";
import ControlHolder from "UI/StoryControls/ControlHolder";
import { AllControlMap } from "UI/StoryControls/ControlMap";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import RightList from "UI/Styles/List/RightList";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";
import ImageButton from "UI/Utils/ImageButton";
import { Counter } from "Utils/NumberUtils";
import { ParametrizeControls } from "../PreviewController/Mounters/Utils";

interface SortEntry {
	name: string;
	control: ObjectControl | ControlGroup<ConvertedControlList>;
}
type SortFunction = (a: SortEntry, b: SortEntry) => boolean;

function OrderSort(a: SortEntry, b: SortEntry) {
	return (a.control.Order ?? 0) < (b.control.Order ?? 0);
}

function NameSort(a: SortEntry, b: SortEntry) {
	if (
		a.control.Order !== undefined &&
		b.control.Order !== undefined &&
		a.control.Order !== b.control.Order
	)
		return OrderSort(a, b);
	if (a.name !== b.name) return a.name < b.name;
	return false;
}

const count = Counter();
const CONTROL_TYPE_ORDERS: Record<
	ObjectControl["Type"] | "ControlGroup",
	number
> = {
	Color3: count(),
	String: count(),
	Number: count(),
	Boolean: count(),
	Choose: count(),
	EnumList: count(),
	RGBA: count(),
	Slider: count(),
	Object: count(),
	ControlGroup: count()
};

function ControlTypeSort(a: SortEntry, b: SortEntry) {
	const typeA =
		a.control.EntryType === "Control" ? a.control.Type : a.control.EntryType;
	const typeB =
		b.control.EntryType === "Control" ? b.control.Type : b.control.EntryType;

	const orderA = CONTROL_TYPE_ORDERS[typeA] ?? math.huge;
	const orderB = CONTROL_TYPE_ORDERS[typeB] ?? math.huge;

	if (orderA === orderB) return OrderSort(a, b);
	return orderA < orderB;
}

const CONTROL_SORTERS: Record<SortMode, SortFunction> = {
	Order: OrderSort,
	Name: NameSort,
	ControlType: ControlTypeSort
};

function useSortedControls(controls: ConvertedControls) {
	const sortMode = useSelector(selectSortMode);

	return useMemo(() => {
		const sortedControls: {
			name: string;
			control: ObjectControl | ControlGroup<ConvertedControlList>;
		}[] = [];
		for (const [name, control] of pairs(controls)) {
			sortedControls.push({ name, control });
		}

		table.sort(sortedControls, CONTROL_SORTERS[sortMode]);
		return sortedControls;
	}, [controls, sortMode]);
}

function CreateControlRender<T extends ObjectControl>(
	control: T,
	current: T["ControlValue"],
	apply: (val: T["ControlValue"]) => void
) {
	const FactoryElement = AllControlMap[
		control.Type
	] as unknown as ControlFactory<T>;
	return <FactoryElement Control={control} Current={current} Apply={apply} />;
}

function RenderControlGroup(
	name: string,
	controlGroup: ControlGroup<ConvertedControlList>,
	groupValues: ParametrizedControls,
	update: (value: ParametrizedControls) => void
) {
	const sortedControls = useSortedControls(controlGroup.Controls);
	const controlComponents: React.Element[] = [];

	for (const { name, control } of sortedControls) {
		const controlValue = groupValues[name] as ControlValue;

		const renderedControl = RenderControl(
			name,
			control as ObjectControl,
			controlValue,
			(value) => {
				update(
					Immut.produce(groupValues, (draft) => {
						draft[name] = value;
					})
				);
			}
		);
		controlComponents.push(renderedControl);
	}
	return (
		<ControlGroupRender GroupName={name} Order={controlGroup.Order}>
			{controlComponents}
		</ControlGroupRender>
	);
}

function RenderControl(
	name: string,
	control: ObjectControl,
	value: ControlValue,
	update: (value: ControlValue) => void
) {
	const subcomponent: ReactChildren = new Map();
	const controlRender = CreateControlRender(control, value, update);
	subcomponent.set("ControlRender", controlRender);

	const render = (
		<ControlHolder
			ControlName={name}
			Order={control.Order}
			ControlReset={() => {
				update(control.ControlValue);
			}}
		>
			{controlRender}
		</ControlHolder>
	);
	return render;
}

interface ControlsProps<T extends ParametrizedControls> {
	Controls: ConvertedControls;
	ControlValues: T;
	SetControlValues: Dispatch<SetStateAction<T>>;
	PreviewKey: string;
}

const TITLE_NAME_WIDTH = 200;

function Controls<T extends ParametrizedControls>(props: ControlsProps<T>) {
	const preview = useSelectorCreator(selectPreview, props.PreviewKey);

	const recoverControls = preview?.RecoverControls ?? false;
	const { updateMountData } = useProducer<RootProducer>();

	const SetControlByIndex = useCallback(
		<K extends keyof T>(index: K, value: T[K]) => {
			props.SetControlValues((old) => {
				return Immut.produce(old, (draft) => {
					const setDraft = draft as T;
					setDraft[index] = value;
				});
			});
		},
		[props.SetControlValues]
	);

	const OnRecoverControls = useCallback(() => {
		if (!preview) return;
		updateMountData(props.PreviewKey, (old) => {
			return { ...old, RecoverControls: !old.RecoverControls };
		});
	}, [props.PreviewKey]);

	const OnResetControls = useCallback(() => {
		const newControls = ParametrizeControls(props.Controls);
		props.SetControlValues(newControls as T);
	}, [props.Controls]);

	const sortedControls = useSortedControls(props.Controls);

	const controlComponents = useMemo(() => {
		const components: React.Element[] = [];

		for (const { name, control } of sortedControls) {
			if (control.EntryType === "ControlGroup") {
				const groupValues = props.ControlValues[name] as ParametrizedControls;
				const render = RenderControlGroup(
					name,
					control,
					groupValues,
					(values) => {
						SetControlByIndex(name, values as T[keyof T]);
					}
				);
				components.push(render);
				continue;
			}

			const controlValue = props.ControlValues[name] as ControlValue;
			const render = RenderControl(name, control, controlValue, (value) => {
				SetControlByIndex(name, value as T[keyof T]);
			});
			components.push(render);
		}

		return components;
	}, [sortedControls, props.ControlValues, SetControlByIndex]);

	return (
		<Div key={"ControlsAction"}>
			<Padding PaddingY={3} />
			<Div key={"TopTitle"} Size={new UDim2(1, 0, 0, 28)}>
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
				<Div key={"IconButtons"} Position={UDim2.fromOffset(0, -2)}>
					<RightList VerticalAlignment={"Center"} Padding={new UDim(0, 2)} />
					<Padding PaddingX={6} />
					<ImageButton
						key={"ReloadIcon"}
						ButtonName="ResetControlsButton"
						Description={"Reset Controls"}
						Icon={"rbxassetid://92882518325887"}
						IconTransparency={0.3}
						Size={UDim2.fromOffset(22, 22)}
						IconScale={0.75}
						OnClick={OnResetControls}
					/>
					<ImageButton
						key={"BookmarkIcon"}
						ButtonName="KeepControlsButton"
						Description={"Keep Controls"}
						Icon={
							recoverControls
								? "rbxassetid://126982529248827"
								: "rbxassetid://114811815528934"
						}
						IconTransparency={0.3}
						Size={UDim2.fromOffset(22, 22)}
						IconScale={0.75}
						OnClick={OnRecoverControls}
					/>
				</Div>
				<Divisor Direction="X" Anchor={0} Position={UDim2.fromScale(0, 1)} />
			</Div>
			<frame
				Position={new UDim2(1, -10, 0.5, 0)}
				AnchorPoint={new Vector2(1, 0.5)}
				Size={new UDim2(0, 0, 1, -2)}
			>
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
				<TopList Padding={new UDim(0, 3)} SortOrder={Enum.SortOrder.Name} />
				{controlComponents}
			</scrollingframe>
		</Div>
	);
}

export default Controls;
