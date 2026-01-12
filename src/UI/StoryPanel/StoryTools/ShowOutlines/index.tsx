import { useDeferCallback } from "@rbxts/pretty-react-hooks";
import React, { Binding, useEffect, useMemo } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useRerender } from "Hooks/Utils/ReRender";
import { Div } from "UI/Styles/Div";

import Listener from "./Listener";
import Outliner from "./Outliner";
import { GetOutlinedComponents } from "./Utils";

interface ShowOutlinesProps {
	PreviewEntry: PreviewEntry;
	Anchor: Binding<Vector2>;
}

function ShowOutlines(props: ShowOutlinesProps) {
	const [id, Recompute] = useRerender();
	const holder = props.PreviewEntry.Holder;
	const { setActionComponent, unsetActionComponent } = useProducer<RootProducer>();

	const renderInfo = useMemo(() => {
		if (!holder) return [[], []];
		return GetOutlinedComponents(holder);
	}, [holder, id]);

	const [OnDeferRecompute] = useDeferCallback(() => {
		Recompute();
	});

	/*
	useEffect(() => {
		setActionComponent(props.PreviewEntry.Key, "OutlinerTab", {
			DisplayName: "Outline Options",
			Render: <OutlinesAction />,
		});
		return () => {
			unsetActionComponent(props.PreviewEntry.Key, "OutlinerTab");
		};
	}, [props.PreviewEntry]);*/

	const outliners = useMemo(() => {
		const components: ReactChildren = new Map();
		for (const component of renderInfo[0]) {
			components.set(
				component.GetDebugId(),
				<Outliner Component={component} Inset={props.Anchor} OnImportantChange={OnDeferRecompute} />
			);
		}
		for (const component of renderInfo[1]) {
			components.set(component.GetDebugId(), <Listener Component={component} OnImportantChange={OnDeferRecompute} />);
		}
		return components;
	}, [renderInfo, props.Anchor]);

	useEffect(() => {
		if (!holder) return;

		const added = holder.DescendantAdded.Connect(() => {
			OnDeferRecompute();
		});
		const removing = holder.DescendantRemoving.Connect(() => {
			OnDeferRecompute();
		});
		return () => {
			added.Disconnect();
			removing.Disconnect();
		};
	}, [holder]);

	return <Div key={"Outliners"}>{outliners}</Div>;
}

export default ShowOutlines;
