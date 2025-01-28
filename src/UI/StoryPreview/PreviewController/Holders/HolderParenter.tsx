import React, { useMemo } from "@rbxts/react";
import LifetimeComponent from "UI/Holders/LifetimeChildren/LifetimeComponent";
import { CreateHolder } from ".";

interface HolderParenterProps {
	MountFrame: Frame;
	Entry: PreviewEntry;
	MountType?: MountType;
	SetCanReload: (canReload: boolean) => void;
}

//This component parents your story.
// Im using "LifetimeComponent" to delay the components unmounting and avoid to React destroying the story
function HolderParenter(props: HolderParenterProps) {
	const entry = props.Entry;

	const holdersMount = useMemo(() => {
		const holders = new Map<HolderType, React.Element>();

		const mainHolder: HolderType = entry.OnWidget ? "Widget" : "Editor";
		holders.set(
			mainHolder,
			CreateHolder(
				mainHolder,
				entry,
				props.MountType,
				props.MountFrame,
				props.SetCanReload
			)
		);

		if (entry.OnViewport) {
			holders.set(
				"Viewport",
				CreateHolder(
					"Viewport",
					entry,
					props.MountType,
					props.MountFrame,
					props.SetCanReload
				)
			);
		}
		return holders;
	}, [entry]);

	return <LifetimeComponent>{holdersMount}</LifetimeComponent>;
}

export default HolderParenter;
