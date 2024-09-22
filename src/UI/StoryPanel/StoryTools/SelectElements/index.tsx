import React, { Binding, useEffect, useMemo, useState } from "@rbxts/react";
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

function GetSelectedGuis(root?: Frame) {
	return () => {
		if (!root) return [];

		const selections = Selection.Get() as GuiObject[];
		if (selections.isEmpty()) return [];

		return selections.filter((selection) => selection.IsA("GuiObject") && selection.IsDescendantOf(root));
	};
}

function SelectElements(props: SelectElementsProps) {
	const mousePos = useMousePos();
	const widget = useSelector(selectPluginWidget);
	const { addMouseIconAction, removeMouseIconAction } = useProducer<RootProducer>();
	const holder = props.PreviewEntry.Holder;
	const [selectedElements, setSelectedElements] = useState<GuiObject[]>(GetSelectedGuis(holder));
	const [passThrough, setPassThrough] = useState(false);
	const inputBegan = useInputBegan();
	const inputEnded = useInputEnded();
	const [hovered, setHovered] = useState<GuiObject[]>([]);

	const hoveredElement = useMemo(() => {
		if (!props.Inside) return undefined;
		if (!passThrough) return hovered[0];
		if (selectedElements.isEmpty()) return hovered[0];
		let passDepth = 0;

		for (const selected of selectedElements) {
			const index = hovered.indexOf(selected);
			if (index < 0) continue;
			passDepth = math.max(passDepth, index + 1);
		}
		if (passDepth >= hovered.size()) return undefined;
		return hovered[passDepth];
	}, [hovered, props.Inside, passThrough, selectedElements]);

	useEffect(() => {
		const selected = GetSelectedGuis(holder)();
		setSelectedElements(selected);
	}, [holder]);
	useEventListener(Selection.SelectionChanged, () => {
		const selected = GetSelectedGuis(holder)();
		setSelectedElements(selected);
	});

	useEventListener(inputBegan, (input) => {
		if (!props.Inside) return;
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setPassThrough(true);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			if (!hoveredElement) return;
			Selection.Set([hoveredElement]);
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
			setHovered(inside);
		});

		return () => connection.Disconnect();
	}, [props.Inside, widget, holder]);

	useEffect(() => {
		if (!props.Inside) {
			setHovered([]);
		}
	}, [props.Inside]);

	useStoryLockAction("SelectElements", props.Inside);

	return (
		<Div key={"SelectElements"}>
			{hoveredElement !== undefined && holder && (
				<ComponentHighlight key={"SelectedElement"} UIComponent={hoveredElement} Holder={holder} Inset={props.Anchor} />
			)}
		</Div>
	);
}

export default SelectElements;
