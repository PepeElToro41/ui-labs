import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import type { MounterProps } from "..";
import { ParametrizeControls, useControls } from "./Utils";
import { useProducer } from "@rbxts/react-reflex";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useUnmountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Controls from "UI/StoryPreview/StoryActionRenders/Controls";
import Summary from "UI/StoryPreview/StoryActionRenders/Summary";
import { InferControls } from "@rbxts/ui-labs";
import { useInputSignals } from "Context/UserInputContext";

function ReactLib(props: MounterProps<"ReactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
	const rendererType = result.renderer ?? "deferred";

	const signals = useInputSignals();
	const { setActionComponent } = useProducer<RootProducer>();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			return result.story({ controls: controlValues as InferControls<ReturnControls>, inputListener: signals });
		} else {
			return result.story;
		}
	}, [controlValues, result]);

	const root = useMemo(() => {
		if (rendererType === "deferred") {
			return result.reactRoblox.createRoot(props.MountFrame);
		} else if (rendererType === "legacy") {
			if (result.reactRoblox["createLegacyRoot"] === undefined) {
				warn('UI-Labs: Legacy renderer requires the function "createLegacyRoot" inside React-Roblox');
				return result.reactRoblox.createRoot(props.MountFrame);
			}
			return result.reactRoblox.createLegacyRoot(props.MountFrame);
		} else {
			warn(`UI-Labs: Renderer Type is not a valid type, "legacy" or "deferred" expected, got: "${rendererType}"`);
		}
	}, []);

	useEffect(() => {
		const component = RenderComponent();
		if (root !== undefined) {
			root.render(component);
		}
	}, []);
	useUnmountEffect(() => {
		if (root !== undefined) {
			root.unmount();
		}
	});

	useUpdateEffect(() => {
		const component = RenderComponent();
		if (root !== undefined) {
			root.render(component);
		}
	}, [controlValues, result]);

	useEffect(() => {
		if (props.Result.summary !== undefined) {
			setActionComponent(props.Entry.Key, "SummaryTab", {
				DisplayName: "Summary",
				Render: <Summary SummaryText={props.Result.summary}></Summary>,
			});
		}
		if (returnControls !== undefined) {
			setActionComponent(props.Entry.Key, "ControlsTab", {
				DisplayName: "Controls",
				Render: <Controls Controls={controls} ControlValues={controlValues} SetControlValues={setControlValues} />,
				Order: 2,
			});
		}
	}, [result, controlValues]);

	return <React.Fragment></React.Fragment>;
}

export default ReactLib;
