import React, { useEffect, useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { EnvironmentHolder } from "Actions/StoryLoading/Holder";
import { selectPreview } from "Reflex/StoryPreview";

import StoryPreview from "./StoryPreview";

interface EnvironmentSchedulerProps {
	RootEnvironment: string;
	Environments: string[];
}

function EnvironmentScheduler(props: EnvironmentSchedulerProps) {
	const targetPreview = useSelector(selectPreview(props.RootEnvironment));

	const schedulerHolder = useMemo(() => {
		const holder = new EnvironmentHolder(props.RootEnvironment);
		return holder;
	}, [props.RootEnvironment]);

	useEffect(() => {
		if (!targetPreview) return;

		schedulerHolder.ScheduleStory(props.RootEnvironment);
		//schedulerHolder.ScheduleStory(targetPreview);
	}, [props.RootEnvironment, props.Environments, schedulerHolder]);

	useEffect(() => {
		return () => schedulerHolder.Destroy();
	}, [schedulerHolder]);

	const previewRenders = useMemo(() => {
		const renders: ReactChildren = new Map();

		props.Environments.forEach((uid) => {
			renders.set(
				uid,
				<StoryPreview PreviewUID={uid} EnvironmentHolder={schedulerHolder} EnvironmentTarget={props.RootEnvironment} />
			);
		});

		return renders;
	}, [props.RootEnvironment, props.Environments, schedulerHolder]);

	return <React.Fragment>{previewRenders}</React.Fragment>;
}

export default EnvironmentScheduler;
