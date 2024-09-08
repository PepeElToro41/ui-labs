import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import type { MounterProps } from "..";
import { ParametrizeControls, useControls, useStoryActionComponents, useStoryPassedProps } from "../Utils";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferControls } from "@rbxts/ui-labs";
import { useStoryUnmount } from "../../Utils";

function ReactLib(props: MounterProps<"ReactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
	const rendererType = result.renderer ?? "deferred";
	const GetProps = useStoryPassedProps();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			const storyProps = GetProps({ controls: controlValues as InferControls<ReturnControls> });

			return result.story(storyProps);
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
	useStoryUnmount(result, props.UnmountSignal, () => {
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

	useStoryActionComponents(props.Entry, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default ReactLib;
