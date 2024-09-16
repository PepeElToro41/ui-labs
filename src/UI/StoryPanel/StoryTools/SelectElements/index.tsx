import React, { Binding, useEffect, useState } from "@rbxts/react";
import { useInputBegan, useInputEnded, useMousePos } from "Hooks/Context/UserInput";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { RunService, Selection } from "@rbxts/services";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useStoryLockAction } from "../Utils";
import { Div } from "UI/Styles/Div";
import { selectPluginWidget } from "Reflex/Plugin";
import { GetGuisAtPosition } from "./Utils";
import ComponentHighlight from "./Highlight";

interface SelectElementsProps {
	Inside: boolean;
	Anchor: Binding<Vector2>;
	PreviewEntry: PreviewEntry;
}

function GetSelectedGui(root?: Frame) {
	return () => {
		if (!root) return undefined;

		const selections = Selection.Get() as Instance[];
		if (selections.size() !== 1) return undefined;
		const selected = selections[0];
		if (!selected.IsA("GuiObject")) return undefined;
		if (!selected.IsDescendantOf(root)) return undefined;

		return selected;
	};
}

function SelectElements(props: SelectElementsProps) {
	const mousePos = useMousePos();
	const widget = useSelector(selectPluginWidget);
	const { addMouseIconAction, removeMouseIconAction } = useProducer<RootProducer>();
	const holder = props.PreviewEntry.Holder;
	const [hoveredElement, setHoveredElement] = useState<GuiObject>();
	const [selectedElement, setSelectedElement] = useState<GuiObject | undefined>(GetSelectedGui(holder));
	const [passThrough, setPassThrough] = useState(false);
	const inputBegan = useInputBegan();
	const inputEnded = useInputEnded();
	const [inside, setInside] = useState<GuiObject[]>([]);

	useEffect(() => {
		const selected = GetSelectedGui(holder)();
		setSelectedElement(selected);
	}, [holder]);
	useEventListener(Selection.SelectionChanged, () => {
		const selected = GetSelectedGui(holder)();
		setSelectedElement(selected);
	});
	useEventListener(inputBegan, (input) => {
		if (!props.Inside) return;
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setPassThrough(true);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			if (inside.isEmpty()) return;
			const selected = inside[0];
			if (selected.IsA("GuiObject")) {
				Selection.Set([selected]);
			}
		}
	});
	useEventListener(inputEnded, (input) => {
		if (input.KeyCode !== Enum.KeyCode.LeftShift) return;
		setPassThrough(false);
	});

	useEffect(() => {
		if (passThrough) {
			addMouseIconAction("OnionLayers");
		} else {
			removeMouseIconAction("OnionLayers");
		}
	}, [passThrough]);

	useEffect(() => {
		if (!props.Inside) return;
		if (!holder) return;

		const connection = RunService.Heartbeat.Connect(() => {
			const inside = GetGuisAtPosition(holder, mousePos.getValue());
			setInside(inside);
		});

		return () => connection.Disconnect();
	}, [props.Inside, widget, holder]);

	useStoryLockAction("SelectElements", props.Inside);

	return (
		<Div key={"SelectElements"}>
			{!inside.isEmpty() && holder && (
				<ComponentHighlight key={"SelectedElement"} UIComponent={inside[0]} Holder={holder} Inset={props.Anchor} />
			)}
		</Div>
	);
}

export default SelectElements;
