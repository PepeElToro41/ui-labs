import React, { useCallback, useEffect, useMemo } from "@rbxts/react";
import type { MounterProps } from "..";
import { useControls, useParametrizedControls, useStoryActionComponents, useStoryPassedProps } from "../Hooks";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferControls } from "@rbxts/ui-labs";
import { useStoryUnmount } from "../../Utils";
import { UILabsWarn, YCall } from "Utils/MiscUtils";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";

const REACT_ERR = WARNING_STORY_TYPES.React;

function ReactLib(props: MounterProps<"ReactLib">) {
	const result = props.Result;
	const returnControls = result.controls as ReturnControls;

	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData,
	);
	const rendererType = result.renderer ?? "deferred";
	const GetProps = useStoryPassedProps();

	const RenderComponent = useCallback(() => {
		if (typeIs(result.story, "function")) {
			const storyProps = GetProps({ controls: controlValues as InferControls<ReturnControls> });

			return YCall(result.story, storyProps, (didYield, err) => {
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(REACT_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(REACT_ERR), err);
				}
			});
		} else {
			return result.story;
		}
	}, [controlValues, result]);

	const root = useMemo(() => {
		if (rendererType === "deferred") {
			return result.reactRoblox.createRoot(props.MountFrame);
		} else if (rendererType === "legacy") {
			if (result.reactRoblox["createLegacyRoot"] === undefined) {
				UILabsWarn('Legacy renderer requires the function "createLegacyRoot" inside React-Roblox');
				return result.reactRoblox.createRoot(props.MountFrame);
			}
			return result.reactRoblox.createLegacyRoot(props.MountFrame);
		} else {
			UILabsWarn(`Renderer Type is not a valid type, "legacy" or "deferred" expected, got: "${rendererType}"`);
		}
	}, []);

	useEffect(() => {
		const component = RenderComponent();
		if (root !== undefined) {
			root.render(component);
		}
	}, []);
	useUpdateEffect(() => {
		const component = RenderComponent();
		if (root !== undefined) {
			root.render(component);
		}
	}, [controlValues, result]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		if (root !== undefined) {
			root.unmount();
		}
	});

	useStoryActionComponents(props.Entry.Key, props.Result, returnControls, controls, controlValues, setControlValues);

	return <React.Fragment></React.Fragment>;
}

export default ReactLib;
