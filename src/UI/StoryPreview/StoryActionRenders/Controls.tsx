import Immut from "@rbxts/immut";
import React, {
	Dispatch,
	PropsWithChildren,
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
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { selectSortMode, SortMode } from "Reflex/PluginSettings";
import { selectPreview } from "Reflex/StoryPreview";
import ControlGroupRender from "UI/StoryControls/ControlGroupRender";
import ControlHolder from "UI/StoryControls/ControlHolder";
import { AllControlMap } from "UI/StoryControls/ControlMap";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
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
	ControlGroup: count(),
	String: count(),
	Number: count(),
	Boolean: count(),
	Color3: count(),
	Slider: count(),
	Choose: count(),
	EnumList: count(),
	Object: count(),
	RGBA: count()
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

function SortControls(controls: ConvertedControls, sortMode: SortMode) {
	const sortedControls: {
		name: string;
		control: ObjectControl | ControlGroup<ConvertedControlList>;
	}[] = [];
	for (const [name, control] of pairs(controls)) {
		sortedControls.push({ name, control });
	}

	table.sort(sortedControls, CONTROL_SORTERS[sortMode]);
	return sortedControls;
}

function RenderControlGroup(
	name: string,
	sortMode: SortMode,
	order: number,
	controlGroup: ControlGroup<ConvertedControlList>,
	groupValues: ParametrizedControls,
	update: (value: ParametrizedControls) => void
) {
	const controlComponents: React.Element[] = [];
	const sortedControls = SortControls(controlGroup.Controls, sortMode);

	for (let order = 0; order < sortedControls.size(); order++) {
		const { name, control } = sortedControls[order];
		const controlValue = groupValues[name] as ControlValue;

		const renderedControl = RenderControl(
			name,
			order,
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
		<ControlGroupRender key={name} GroupName={name} LayoutOrder={order}>
			{controlComponents}
		</ControlGroupRender>
	);
}

function RenderControl(
	name: string,
	order: number,
	control: ObjectControl,
	value: ControlValue,
	update: (value: ControlValue) => void
) {
	const FactoryElement = AllControlMap[
		control.Type
	] as unknown as ControlFactory<any>;

	const render = (
		<ControlHolder
			key={name}
			ControlName={name}
			LayoutOrder={order}
			ControlReset={() => {
				update(control.ControlValue);
			}}
		>
			{<FactoryElement Control={control} Current={value} Apply={update} />}
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

interface TitleSortEntryProps extends PropsWithChildren {
	SortMode: SortMode;
	Title: string;
	Size: UDim2;
}

function TitleSortEntry(props: TitleSortEntryProps) {
	const theme = useTheme();
	const { setSortMode } = useProducer<RootProducer>();
	const sortMode = useSelector(selectSortMode);
	const [hovered, hoverApi] = useToggler(false);

	const OnSetSortMode = useCallback(() => {
		if (sortMode === props.SortMode) {
			setSortMode("Order");
		} else {
			setSortMode(props.SortMode);
		}
	}, [sortMode, props.SortMode]);

	return (
		<Detector
			Size={props.Size}
			BackgroundTransparency={hovered ? 0.6 : 1}
			BackgroundColor3={theme.StoryPanel.DarkColor}
			BorderSizePixel={0}
			Event={{
				MouseEnter: hoverApi.enable,
				MouseLeave: hoverApi.disable,
				MouseButton1Click: OnSetSortMode
			}}
		>
			<Padding PaddingX={8} />
			<LeftList
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 5)}
			/>
			<imagelabel
				Size={UDim2.fromOffset(8, 5)}
				Image={"rbxassetid://14010784349"}
				ImageColor3={theme.Text.Color}
				BackgroundTransparency={1}
				Visible={sortMode === props.SortMode}
			/>
			<Text
				Text={props.Title}
				Size={UDim2.fromScale(1, 1)}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			{props.children}
		</Detector>
	);
}

function Controls<T extends ParametrizedControls>(props: ControlsProps<T>) {
	const preview = useSelectorCreator(selectPreview, props.PreviewKey);
	const sortMode = useSelector(selectSortMode);

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

	const controlComponents = useMemo(() => {
		const components: React.Element[] = [];
		const sortedControls = SortControls(props.Controls, sortMode);

		for (let order = 0; order < sortedControls.size(); order++) {
			const { name, control } = sortedControls[order];

			if (control.EntryType === "ControlGroup") {
				const groupValues = props.ControlValues[name] as ParametrizedControls;
				const render = RenderControlGroup(
					name,
					sortMode,
					order,
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
			const render = RenderControl(
				name,
				order,
				control,
				controlValue,
				(value) => {
					SetControlByIndex(name, value as T[keyof T]);
				}
			);
			components.push(render);
		}

		return components;
	}, [sortMode, props.Controls, props.ControlValues, SetControlByIndex]);

	return (
		<Div key={"ControlsAction"}>
			<Div key={"TopTitle"} Size={new UDim2(1, 0, 0, 32)}>
				<Div key={"TitleList"}>
					<LeftList
						Padding={new UDim(0, 2)}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					<TitleSortEntry
						SortMode={"Name"}
						Title={"Name"}
						Size={new UDim2(0, TITLE_NAME_WIDTH, 1, 0)}
					/>
					<TitleSortEntry
						SortMode={"ControlType"}
						Title={"Control"}
						Size={UDim2.fromScale(1, 1)}
					>
						<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
					</TitleSortEntry>
					<Div
						key={"IconButtons"}
						AutomaticSize={Enum.AutomaticSize.X}
						Size={UDim2.fromScale(0, 1)}
					>
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
				Size={new UDim2(1, 0, 1, -33)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={UDim2.fromScale(0, 0)}
				Position={UDim2.fromOffset(0, 33)}
			>
				<TopList Padding={new UDim(0, 3)} />
				{controlComponents}
			</scrollingframe>
		</Div>
	);
}

export default Controls;
